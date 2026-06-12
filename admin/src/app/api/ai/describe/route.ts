import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebase-admin';
import { COL } from '@shared/firestore-paths';
import { BRAND } from '@/lib/brand';

/**
 * AI Product Description Writer — the first paid AI feature.
 *
 * POST { vendorId, titleAr?, titleEn?, hints?, price? }
 * Header: Authorization: Bearer <Firebase ID token>
 *
 * Flow: verify the vendor's Firebase token → confirm they own the vendor doc
 * → enforce the monthly AI quota for their tier → one Claude call with a
 * fixed server-side prompt (vendors never send free-form prompts) → return
 * { titleAr, titleEn, descAr, descEn }.
 *
 * Requires ANTHROPIC_API_KEY in admin/.env.local. Model overridable via
 * AI_MODEL (defaults to claude-opus-4-8).
 */

/** Monthly AI generations per tier — the upsell ladder. */
const QUOTA: Record<string, number> = { free: 5, basic: 30, pro: 200, managed: 500 };
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ai_not_configured' }, { status: 503 });
  }

  // ── auth: Firebase ID token → uid ──
  const authz = req.headers.get('authorization') ?? '';
  const idToken = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (!idToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let uid: string;
  try {
    adminDb(); // ensures the admin app is initialized
    uid = (await getAuth().verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { vendorId, titleAr, titleEn, hints, price } = body as {
    vendorId?: string; titleAr?: string; titleEn?: string; hints?: string; price?: number;
  };
  if (!vendorId || (!titleAr && !titleEn && !hints)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // ── ownership + tier ──
  const vendorSnap = await adminDb().collection(COL.vendors).doc(vendorId).get();
  const vendor = vendorSnap.data();
  if (!vendor || vendor.ownerUid !== uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const tierActive = vendor.tier && (vendor.subscriptionUntil ?? 0) > Date.now();
  const tier = tierActive ? (vendor.tier as string) : 'free';

  // ── monthly quota ──
  const usageRef = adminDb().collection('aiUsage').doc(vendorId);
  const usageSnap = await usageRef.get();
  const usage = usageSnap.data() ?? { count: 0, resetAt: 0 };
  const now = Date.now();
  if (usage.resetAt < now) {
    usage.count = 0;
    usage.resetAt = now + MONTH_MS;
  }
  const limit = QUOTA[tier] ?? QUOTA.free;
  if (usage.count >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit, tier }, { status: 429 });
  }

  // ── the Claude call: fixed template, vendor data slotted in ──
  const client = new Anthropic();
  const model = process.env.AI_MODEL || 'claude-opus-4-8';
  const input = [
    titleAr ? `الاسم بالعربي: ${titleAr}` : null,
    titleEn ? `Name in English: ${titleEn}` : null,
    hints ? `ملاحظات البائع: ${hints}` : null,
    typeof price === 'number' && price > 0 ? `السعر: ${price} د.ك` : null,
  ].filter(Boolean).join('\n');

  try {
    const response = await client.messages.parse({
      model,
      max_tokens: 1024,
      system:
        `أنت كاتب تسويقي لمنصة ${BRAND.ar} (${BRAND.en}) — سوق المشاريع المنزلية الكويتية. ` +
        'اكتب عناوين وأوصاف منتجات تبيع: قصيرة، شهية، باللهجة الكويتية الودودة للعربي ' +
        '(حياك، يديد، لذيذ) وإنجليزية بسيطة وأنيقة. الوصف ٢–٣ جمل كحد أقصى، بدون مبالغة فارغة، ' +
        'وبدون إيموجي زائد (واحد كحد أقصى). لا تذكر السعر داخل الوصف.',
      messages: [{ role: 'user', content: `اكتب عنواناً ووصفاً لهذا المنتج:\n${input}` }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              titleAr: { type: 'string', description: 'عنوان المنتج بالعربي (٣–٦ كلمات)' },
              titleEn: { type: 'string', description: 'Product title in English (3-6 words)' },
              descAr: { type: 'string', description: 'وصف بالعربي الكويتي، ٢–٣ جمل' },
              descEn: { type: 'string', description: 'English description, 2-3 sentences' },
            },
            required: ['titleAr', 'titleEn', 'descAr', 'descEn'],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
    }

    // count the successful generation
    await usageRef.set(
      { count: usage.count + 1, resetAt: usage.resetAt, updatedAt: now },
      { merge: true },
    );

    return NextResponse.json({
      ...(response.parsed_output as Record<string, string>),
      used: usage.count + 1,
      limit,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'ai_error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
