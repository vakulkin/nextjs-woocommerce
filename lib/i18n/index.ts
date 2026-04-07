import { en } from "./en";
import { custom } from "./custom";
import type { Translations, CustomTranslations } from "./en";

export type { Translations, CustomTranslations };

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T>
): T {
  const result = { ...base };
  for (const key in override) {
    const ov = override[key as keyof DeepPartial<T>];
    if (ov === undefined) continue;
    const bv = base[key as keyof T];
    if (
      typeof ov === "object" &&
      ov !== null &&
      typeof bv === "object" &&
      bv !== null &&
      !Array.isArray(ov)
    ) {
      result[key as keyof T] = deepMerge(
        bv as Record<string, unknown>,
        ov as DeepPartial<Record<string, unknown>>
      ) as T[keyof T];
    } else {
      result[key as keyof T] = ov as T[keyof T];
    }
  }
  return result;
}

/** Final translations — use this throughout the app. */
export const t = deepMerge(en, custom);
