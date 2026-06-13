import { NextRequest, NextResponse } from 'next/server';
import { BRAND } from '@/lib/brand';
import {
  aiConfigured,
  anthropic,
  aiModel,
  verifyBearer,
  resolveTier,
  claimQuota,
  refundQuota,
  clampField,
  MAX_TOTAL_LEN,
} from '@/lib/ai';

/**
 * AI Storefront Writer — takes whatever the vendor typed (one language,
 * rough words, even just a store name) and returns a polished bilingual
 * identity: name AR/EN + bio AR/EN. This removes the "which language do I
 * write in?" problem entirely: write anything, AI fills both.
 *
 * POST { name, bio?, area? }  ·  Authorization: Bearer <Firebase ID token>
 * Quota is keyed by uid (works before the vendor doc exists). Atomic claim +
 * per-uid rate-limit via the shared ai helper.
 */
export async function POST(req: NextRequest) {
  if (!aiConfigured()) {
    return NextResponse.json({ error: 'ai_not_configured' }, { status: 503 });
  }

  const uid = await verifyBearer(req.headers.get('authorization'));
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = clampField((body as { name?: unknown }).name);
  const bio = clampField((body as { bio?: unknown }).bio);
  const area = clampField((body as { area?: unknown }).area, 80);
  if (!name) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // Tier from the vendor doc when it exists; new signups count as free tier.
  const tier = await resolveTier(uid);

  // ── atomic monthly quota (keyed by uid) ──
  const claim = await claimQuota(uid, tier);
  if (!claim.ok) {
    return NextResponse.json(
      { error: claim.reason, limit: claim.limit, tier: claim.tier },
      {
        status: 429,
        ...(claim.retryAfterMs
          ? { headers: { 'Retry-After': String(Math.ceil(claim.retryAfterMs / 1000)) } }
          : {}),
      },
    );
  }

  const input = [
    `اسم المتجر كما كتبه صاحبه: ${name}`,
    bio ? `النبذة كما كتبها: ${bio}` : null,
    area ? `المنطقة: ${area}` : null,
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, MAX_TOTAL_LEN);

  try {
    const response = await anthropic().messages.parse({
      model: aiModel(),
      max_tokens: 1024,
      system:
        `أنت كاتب هوية تجارية لمنصة ${BRAND.ar} (${BRAND.en}) لمشاريع البيوت الكويتية. ` +
        'يعطيك البائع اسم متجره وكلمات بسيطة عن شغله بأي لغة — وأنت ترجع هوية ثنائية اللغة جاهزة: ' +
        'اسم عربي واسم إنجليزي (نفس المعنى، مناسب كاسم علامة)، ونبذة عربية باللهجة الكويتية الودودة ' +
        '(٢ جملة كحد أقصى، تبيع بدون مبالغة) ونبذة إنجليزية أنيقة بنفس المعنى. ' +
        'إذا الاسم أصلاً عربي خلّه كما هو وترجمه للإنجليزي بشكل لائق، والعكس صحيح. بدون إيموجي.',
      messages: [{ role: 'user', content: input }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              nameAr: { type: 'string' },
              nameEn: { type: 'string' },
              bioAr: { type: 'string' },
              bioEn: { type: 'string' },
            },
            required: ['nameAr', 'nameEn', 'bioAr', 'bioEn'],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      await refundQuota(uid);
      return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
    }

    return NextResponse.json({
      ...(response.parsed_output as Record<string, string>),
      used: claim.used,
      limit: claim.limit,
    });
  } catch {
    await refundQuota(uid);
    return NextResponse.json({ error: 'ai_error' }, { status: 502 });
  }
}
