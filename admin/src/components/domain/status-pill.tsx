import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Dict } from '@/i18n/dict';
import type { VendorStatus, SubscriptionStatus, SubscriptionTier } from '@shared/types';

export function VendorStatusPill({ status, t }: { status: VendorStatus; t: Dict }) {
  const map: Record<VendorStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
    active: { label: t.vendors.filterActive, tone: 'success' },
    pending: { label: t.vendors.filterPending, tone: 'warning' },
    suspended: { label: t.vendors.filterSuspended, tone: 'danger' },
    rejected: { label: t.vendors.filterRejected, tone: 'neutral' },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function SubscriptionStatusPill({ status, t }: { status: SubscriptionStatus; t: Dict }) {
  const map: Record<SubscriptionStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info' }> = {
    trialing: { label: t.subscriptions.statusTrialing, tone: 'info' },
    active: { label: t.subscriptions.statusActive, tone: 'success' },
    past_due: { label: t.subscriptions.statusPastDue, tone: 'warning' },
    cancelled: { label: t.subscriptions.statusCancelled, tone: 'neutral' },
    paused: { label: t.subscriptions.statusPaused, tone: 'neutral' },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function TierPill({ tier, t }: { tier: SubscriptionTier; t: Dict }) {
  const map: Record<SubscriptionTier, { label: string; tone: 'neutral' | 'info' | 'brand' }> = {
    basic: { label: t.subscriptions.tierBasic, tone: 'neutral' },
    pro: { label: t.subscriptions.tierPro, tone: 'info' },
    managed: { label: t.subscriptions.tierManaged, tone: 'brand' },
  };
  const m = map[tier];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
