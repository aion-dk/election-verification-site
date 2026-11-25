import { describe, it, expect, vi, afterEach } from "vitest";

type AppConfig = {
  VITE_LOGO_URL: string;
  VITE_DBB_URL: string;
  VITE_CONFERENCE_URL: string;
  VITE_CONTACT_URL: string;
};

const typedGlobal = globalThis as unknown as { __APP_CONFIG__: AppConfig };
const originalConfig = typedGlobal.__APP_CONFIG__;

async function loadConfig(appConfig: Partial<AppConfig>) {
  typedGlobal.__APP_CONFIG__ = {
    VITE_LOGO_URL: "",
    VITE_DBB_URL: "",
    VITE_CONFERENCE_URL: "",
    VITE_CONTACT_URL: "",
    ...appConfig,
  };
  vi.resetModules();
  return (await import("./config")).default;
}

describe("config", () => {
  afterEach(() => {
    typedGlobal.__APP_CONFIG__ = originalConfig;
  });

  it("reads the URLs from the runtime app config", async () => {
    const config = await loadConfig({
      VITE_DBB_URL: "https://dbb.example.com",
      VITE_CONFERENCE_URL: "https://conference.example.com",
    });

    expect(config).toEqual({
      dbbUrl: "https://dbb.example.com",
      conferenceUrl: "https://conference.example.com",
    });
  });

  it("falls back to the local development URLs when values are empty", async () => {
    const config = await loadConfig({});

    expect(config).toEqual({
      dbbUrl: "http://dbb.localhost:3003",
      conferenceUrl: "http://electa.localhost:3016",
    });
  });
});
