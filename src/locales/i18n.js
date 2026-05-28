import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import ar from './ar';
import en from './en';

const i18n = new I18n({ ar, en });

// Default to Arabic — primary locale for Mshro3e.
const deviceLocale = (Localization.getLocales?.()[0]?.languageCode) || 'ar';
i18n.locale = deviceLocale === 'en' ? 'en' : 'ar';

i18n.enableFallback = true;
i18n.defaultLocale = 'ar';

export default i18n;
