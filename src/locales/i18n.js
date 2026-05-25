import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import ar from './ar';
import en from './en';

const i18n = new I18n({
  ar,
  en,
});

// Set the locale based on the device's locale
i18n.locale = Localization.locale.includes('ar') ? 'ar' : 'en';

// Enable fallback to another language
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;