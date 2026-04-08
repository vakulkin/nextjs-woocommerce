import { en } from "./en";
import { custom } from "./custom";

export type TranslationKey = keyof typeof en;

/** Merged flat dictionary: custom overrides win over en defaults. */
const translations: Record<string, string> = { ...en, ...custom };

/**
 * Look up a translation string by its dot-notation key.
 *
 * @param key     - e.g. "brand.name", "cart.pageTitle"
 * @param fallback - returned when the key is missing (default "")
 */
export function t(key: TranslationKey, fallback = ""): string {
  const val = translations[key];
  if (val === undefined) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[i18n] Missing translation: "${key}"`);
    }
    return fallback;
  }
  return val;
}

