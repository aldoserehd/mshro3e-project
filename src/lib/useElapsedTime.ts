import { useEffect, useState } from 'react';

/**
 * Returns a label like "محدث الآن" / "قبل 12 د" / "قبل 2 س" describing how
 * long ago `since` was. Re-renders every 30s.
 */
export function useElapsedTime(since: number, locale: 'ar' | 'en' = 'ar'): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, now - since);
  const min = Math.floor(diff / 60_000);

  if (min < 1) return locale === 'ar' ? 'محدث الآن' : 'just now';
  if (min < 60) return locale === 'ar' ? `قبل ${min} د` : `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return locale === 'ar' ? `قبل ${hr} س` : `${hr}h ago`;

  const days = Math.floor(hr / 24);
  return locale === 'ar' ? `قبل ${days} ي` : `${days}d ago`;
}
