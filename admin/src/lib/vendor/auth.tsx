'use client';

/**
 * Vendor portal auth — Firebase **client** Auth (email/password), the same
 * identity a vendor uses in the mobile app. Distinct from the owner admin,
 * which uses a server cookie session.
 *
 * Exposes the signed-in Firebase user plus the vendor's own storefront doc
 * (looked up by `ownerUid == uid`). `vendor` is null when the user has signed
 * in but not created a storefront yet.
 */
import * as React from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { authClient, dbClient, firebaseReady } from '@/lib/firebase-client';
import { COL } from '@shared/firestore-paths';
import type { Vendor } from '@shared/types';

interface VendorAuthValue {
  ready: boolean;
  loading: boolean;
  user: User | null;
  vendor: Vendor | null;
  /** Re-fetch the vendor doc (after creating/editing the storefront). */
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = React.createContext<VendorAuthValue | null>(null);

async function loadVendorForUid(uid: string): Promise<Vendor | null> {
  const snap = await getDocs(
    query(collection(dbClient(), COL.vendors), where('ownerUid', '==', uid), limit(1)),
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as object) } as Vendor;
}

export function VendorAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [vendor, setVendor] = React.useState<Vendor | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(authClient(), async (u) => {
      setUser(u);
      if (u) {
        try {
          setVendor(await loadVendorForUid(u.uid));
        } catch {
          setVendor(null);
        }
      } else {
        setVendor(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refresh = React.useCallback(async () => {
    if (user) setVendor(await loadVendorForUid(user.uid));
  }, [user]);

  const signIn = React.useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(authClient(), email.trim(), password);
  }, []);

  const signOut = React.useCallback(async () => {
    await fbSignOut(authClient());
  }, []);

  const value: VendorAuthValue = { ready: firebaseReady, loading, user, vendor, refresh, signIn, signOut };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVendorAuth(): VendorAuthValue {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('useVendorAuth must be used within VendorAuthProvider');
  return v;
}
