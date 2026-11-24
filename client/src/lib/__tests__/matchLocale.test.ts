import { describe, it, expect } from "vitest";
import { matchLocale } from "../matchLocale";

describe("matchLocale", () => {
  it("matches exactly", () => {
    expect(matchLocale(["da"], ["en", "da"])).toBe("da");
  });

  it("matches region-qualified browser locales to the base language", () => {
    expect(matchLocale(["da-DK"], ["en", "da"])).toBe("da");
    expect(matchLocale(["en-US"], ["da", "en"])).toBe("en");
  });

  it("is case-insensitive", () => {
    expect(matchLocale(["EN-us"], ["en"])).toBe("en");
  });

  it("supports 3-letter language codes", () => {
    expect(matchLocale(["fil"], ["en", "fil"])).toBe("fil");
    expect(matchLocale(["fil-PH"], ["en", "fil"])).toBe("fil");
  });

  it("does not confuse fi (Finnish) and fil (Filipino)", () => {
    expect(matchLocale(["fi-FI"], ["fil", "fi"])).toBe("fi");
    expect(matchLocale(["fil-PH"], ["fi", "fil"])).toBe("fil");
    expect(matchLocale(["fi"], ["fil"])).toBeUndefined();
  });

  it("respects the order of requested locales", () => {
    expect(matchLocale(["de-DE", "da-DK"], ["da", "de"])).toBe("de");
    expect(matchLocale(["sv-SE", "da-DK"], ["en", "da"])).toBe("da");
  });

  it("returns undefined when nothing matches or tags are invalid", () => {
    expect(matchLocale(["ja-JP"], ["en", "da"])).toBeUndefined();
    expect(matchLocale(["not a locale!"], ["en"])).toBeUndefined();
    expect(matchLocale([], ["en"])).toBeUndefined();
  });
});
