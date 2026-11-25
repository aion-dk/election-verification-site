import { describe, it, expect } from "vitest";
import { defaultTheme } from "./theme";

describe("defaultTheme", () => {
  it("is a non-empty CSS string", () => {
    expect(typeof defaultTheme).toBe("string");
    expect(defaultTheme.trim().length).toBeGreaterThan(0);
  });

  it("defines the theme custom properties on :root", () => {
    expect(defaultTheme).toContain(":root {");
    expect(defaultTheme).toContain("--av-theme-background: #212529;");
    expect(defaultTheme).toContain("--av-theme-text: white;");
    expect(defaultTheme).toContain("--av-theme-danger-background: #dc3545;");
    expect(defaultTheme).toContain("--av-theme-danger-text: white;");
  });

  it.each([
    ".bg-theme",
    ".bg-theme-transparent",
    ".bg-light-transparent",
    ".bg-dark-transparent",
    ".text-theme",
    ".bg-theme-danger",
    ".bg-theme-danger a",
    ".bg-theme-danger a:hover",
    ".text-contrast",
    ".text-theme-danger",
    ".border-theme",
    ".border-theme-danger",
    ".theme-gradient",
  ])("defines the %s utility class", (selector) => {
    expect(defaultTheme).toContain(`${selector} {`);
  });

  it("uses the dark default background for the theme classes", () => {
    expect(defaultTheme).toMatch(
      /\.bg-theme \{[^}]*background-color: #212529 !important;/,
    );
    expect(defaultTheme).toMatch(/\.text-theme \{[^}]*color: #212529/);
  });

  it("has balanced braces so it can be injected as a stylesheet", () => {
    const open = (defaultTheme.match(/\{/g) || []).length;
    const close = (defaultTheme.match(/\}/g) || []).length;
    expect(open).toBe(close);
    expect(open).toBeGreaterThan(0);
  });
});
