import en from './en';
import fa from './fa';

export type LocaleMessages = typeof en;

export const defaultLocales = {
  en,
  fa,
} as const;

export type Locale = keyof typeof defaultLocales | string;
