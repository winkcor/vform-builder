import { createI18n } from 'vue-i18n';

import { defaultLocales, type Locale, type LocaleMessages } from '../locales';

type CustomLocaleData = Record<string, LocaleMessages>;

let i18nInstance: any = null;
let isInitialized = false;

function createI18nInstance(locale: Locale, customLocaleData?: CustomLocaleData) {
  const messages: Record<string, any> = {
    ...defaultLocales,
    ...(customLocaleData || {}),
  };

  return createI18n({
    locale,
    fallbackLocale: 'en',
    messages,
  });
}

function getLocaleValue(localeRef: any): Locale {
  return typeof localeRef === 'object' && 'value' in localeRef ? localeRef.value : localeRef;
}

function setLocaleValue(localeRef: any, newLocale: Locale) {
  if (typeof localeRef === 'object' && 'value' in localeRef) {
    localeRef.value = newLocale;
  } else {
    localeRef = newLocale;
  }
}

export function useI18n() {
  if (!i18nInstance) {
    i18nInstance = createI18nInstance('en');
  }

  const t = (key: string) => {
    return i18nInstance.global.t(key);
  };

  const setLocale = (newLocale: Locale) => {
    if (i18nInstance) {
      setLocaleValue(i18nInstance.global.locale, newLocale);
    }
  };

  const setCustomLocale = (newLocale: string, messages: LocaleMessages) => {
    if (i18nInstance) {
      i18nInstance.global.setLocaleMessage(newLocale, messages);
    }
  };

  const getLocale = (): Locale => {
    if (!i18nInstance) return 'en';
    return getLocaleValue(i18nInstance.global.locale);
  };

  return {
    t,
    setLocale,
    setCustomLocale,
    getLocale,
  };
}

export function initI18n(locale: Locale, customLocaleData?: CustomLocaleData) {
  if (!isInitialized || !i18nInstance) {
    i18nInstance = createI18nInstance(locale, customLocaleData);
    isInitialized = true;
  } else {
    const currentLocale = i18nInstance.global.locale as any;
    const currentLocaleValue = getLocaleValue(currentLocale);

    if (currentLocaleValue !== locale) {
      setLocaleValue(currentLocale, locale);
    }
    if (customLocaleData) {
      Object.entries(customLocaleData).forEach(([loc, messages]) => {
        i18nInstance.global.setLocaleMessage(loc, messages);
      });
    }
  }
}
