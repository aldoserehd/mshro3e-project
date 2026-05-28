import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency = 'KWD', locale = 'ar-KW') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: currency === 'KWD' ? 3 : 0 }).format(amount);

export const formatDate = (ts: number, locale = 'ar-KW') =>
  new Intl.DateTimeFormat(locale, { calendar: 'gregory', dateStyle: 'medium' }).format(new Date(ts));

export const formatDateTime = (ts: number, locale = 'ar-KW') =>
  new Intl.DateTimeFormat(locale, { calendar: 'gregory', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));
