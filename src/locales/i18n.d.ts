declare const i18n: {
  locale: string;
  defaultLocale: string;
  enableFallback: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
};
export default i18n;
