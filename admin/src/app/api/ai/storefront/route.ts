import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebase-admin';
import { COL } from '@shared/firestore-paths';
import { BRAND } from '@/lib/brand';

/**
 * AI Storefront Writer — takes whatever the vendor typed (one language,
 * rough words, even just a store name) and returns a polished bilingual
 * identity: name AR/EN + bio AR/EN. This removes the "which language do I
 * write in?" problem entirely: write anything, AI fills both.
 *
 * POST { name, bio?, area? }  ·  Authorization: Bearer <Firebase ID token>
 * Quota is keyed by uid (works before the vendor doc exists).
 */
const QUOTA: Record<string, number> = { free: 5, basic: 30, pro: 200, managed: 500 };
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ai_not_configured' }, { status: 503 });
  }

  const authz = req.headers.get('authorization') ?? '';
  const idToken = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (!idToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let uid: string;
  try {
    adminDb();
    uid = (await getAuth().verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, bio, area } = body as { name?: string; bio?: string; area?: string };
  if (!name?.trim()) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // Tier from the vendor doc when it exists; new signups count as free tier.
  let tier = 'free';
  try {
    const snap = await adminDb().collection(COL.vendors).where('ownerUid', '==', uid).limit(1).get();
    const v = snap.docs[0]?.data();
    if (v?.tier && (v.subscriptionUntil ?? 0) > Date.now()) tier = v.tier as string;
  } catch { /* default free */ }

  const usageRef = adminDb().collection('aiUsage').doc(uid);
  const usage = (await usageRef.get()).data() ?? { count: 0, resetAt: 0 };
  const now = Date.now();
  if (usage.resetAt < now) { usage.count = 0; usage.resetAt = now + MONTH_MS; }
  const limit = QUOTA[tier] ?? QUOTA.free;
  if (usage.count >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit, tier }, { status: 429 });
  }

  const client = new Anthropic();
  const model = process.env.AI_MODEL || 'claude-opus-4-8';
  const input = [
    `اسم المتجر كما كتبه صاحبه: ${name.trim()}`,
    bio?.trim() ? `النبذة كما كتبها: ${bio.trim()}` : null,
    area ? `المنطقة: ${area}` : null,
  ].filter(Boolean).join('\n');

  try {
    const response = await client.messages.parse({
      model,
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
      return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
    }

    await usageRef.set({ count: usage.count + 1, resetAt: usage.resetAt, updatedAt: now }, { merge: true });
    return NextResponse.json({
      ...(response.parsed_output as Record<string, string>),
      used: usage.count + 1,
      limit,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'ai_error' }, { status: 502 });
  }
}
