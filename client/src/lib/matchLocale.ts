function languageOf(tag: string): string | null {
  try {
    return new Intl.Locale(tag).language; // "da-DK" -> "da", "fil-PH" -> "fil"
  } catch {
    return null; // invalid BCP 47 tag
  }
}

/**
 * Picks the first of the user's `requested` locales (e.g. `navigator.languages`)
 * whose language subtag is in `available`, so "da-DK" resolves to "da".
 */
export function matchLocale<T extends string>(
  requested: readonly string[],
  available: readonly T[],
): T | undefined {
  for (const tag of requested) {
    const language = languageOf(tag);
    const match = available.find((locale) => locale === language);
    if (match) return match;
  }

  return undefined;
}
