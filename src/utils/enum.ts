export type EnumOf<T extends Record<string, string | number>> = T[keyof T];

export const Constants = {
  CssPrefix: 'vform-builder',
} as const;
export type Constants = EnumOf<typeof Constants>;
