import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock, getMock, useMock } = vi.hoisted(() => {
  const getMock = vi.fn();
  const useMock = vi.fn();
  const createMock = vi.fn(() => ({
    get: getMock,
    interceptors: { response: { use: useMock } },
  }));
  return { createMock, getMock, useMock };
});

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return {
    ...actual,
    default: { ...actual.default, create: createMock },
  };
});

const { responseHandler, responseErrorHandler } = await import("./axiosConfig");
const { useConferenceConnector } = await import("./conferenceServices");
// The instance is created at module load time, so capture the calls now.
const createCallsAtImport = [...createMock.mock.calls];

const translationsResponse = {
  translations: {
    en: {
      js: {
        election_verification_site: { title: "Verify", nested: { a: "b" } },
        components: { button: "Click" },
        accessibility: { skip: "Skip" },
      },
    },
    da: {
      js: {
        election_verification_site: { title: "Verificer" },
        components: { button: "Klik" },
        accessibility: { skip: "Spring over" },
      },
    },
  },
};

describe("useConferenceConnector", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("creates the axios instance with the conference URL", () => {
    expect(createCallsAtImport).toEqual([
      [{ baseURL: "http://electa.localhost:3016" }],
    ]);
  });

  it("attaches the response interceptors only once", () => {
    useConferenceConnector("org", "election");
    useConferenceConnector("org", "other-election");

    expect(useMock).toHaveBeenCalledTimes(1);
    expect(useMock).toHaveBeenCalledWith(responseHandler, responseErrorHandler);
  });

  it("getStatus fetches the status and returns the election", async () => {
    const election = { slug: "election", boardSlug: "board" };
    getMock.mockResolvedValue({ election });
    const { conferenceClient } = useConferenceConnector("org", "election");

    await expect(conferenceClient.getStatus()).resolves.toBe(election);
    expect(getMock).toHaveBeenCalledWith("/org/election/status");
  });

  it("getStylingData fetches the theme", async () => {
    getMock.mockResolvedValue(":root { --color: red; }");
    const { conferenceClient } = useConferenceConnector("org", "election");

    await expect(conferenceClient.getStylingData()).resolves.toBe(
      ":root { --color: red; }",
    );
    expect(getMock).toHaveBeenCalledWith("/org/election/theme");
  });

  it("getPublishedResults fetches the published results", async () => {
    const results = [{ votingRoundName: "Round 1" }];
    getMock.mockResolvedValue(results);
    const { conferenceClient } = useConferenceConnector("org", "election");

    await expect(conferenceClient.getPublishedResults()).resolves.toBe(results);
    expect(getMock).toHaveBeenCalledWith("/org/election/published_results");
  });

  it.each([true, false])(
    "getResultsPublished returns the resultsPublished flag (%s)",
    async (value) => {
      getMock.mockResolvedValue({ resultsPublished: value });
      const { conferenceClient } = useConferenceConnector("org", "election");

      await expect(conferenceClient.getResultsPublished()).resolves.toBe(value);
      expect(getMock).toHaveBeenCalledWith("/org/election/results_published");
    },
  );

  it("getTranslationsData builds the EVS messages and caches the response", async () => {
    getMock.mockResolvedValue(translationsResponse);
    const { conferenceClient } = useConferenceConnector("org", "election");

    const en = await conferenceClient.getTranslationsData("en");

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith("/org/election/translations");
    expect(en).toEqual({
      title: "Verify",
      nested: { a: "b" },
      js: {
        components: { button: "Click" },
        accessibility: { skip: "Skip" },
      },
    });

    const da = await conferenceClient.getTranslationsData("da");

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(da).toEqual({
      title: "Verificer",
      js: {
        components: { button: "Klik" },
        accessibility: { skip: "Spring over" },
      },
    });
  });
});
