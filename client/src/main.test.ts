import "./test-utils/setupConfig";
import { describe, it, expect, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let resolveReady: () => void;
  const readyPromise = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });
  // Plain record (not a vi.fn) so registrations survive mock clearing
  // between tests: main.ts is only evaluated once per test file.
  const directives: Record<string, { mounted: (el: unknown) => void }> = {};
  const app = {
    use: vi.fn(),
    directive: vi.fn(),
    mount: vi.fn(),
  };
  app.use.mockReturnValue(app);
  app.directive.mockImplementation((name, definition) => {
    directives[name] = definition;
    return app;
  });
  return {
    app,
    directives,
    createApp: vi.fn(() => app),
    pinia: { install: vi.fn(), name: "fake-pinia" },
    router: { install: vi.fn(), isReady: vi.fn(() => readyPromise) },
    i18n: { install: vi.fn(), name: "fake-i18n" },
    uiLibrary: { install: vi.fn() },
    App: { name: "FakeApp" },
    resolveReady: () => resolveReady(),
  };
});

vi.mock("vue", async (importOriginal) => ({
  ...(await importOriginal<typeof import("vue")>()),
  createApp: mocks.createApp,
}));
vi.mock("pinia", async (importOriginal) => ({
  ...(await importOriginal<typeof import("pinia")>()),
  createPinia: () => mocks.pinia,
}));
vi.mock("./App.vue", () => ({ default: mocks.App }));
vi.mock("./router", () => ({ default: mocks.router }));
vi.mock("./lib/i18n", () => ({ default: mocks.i18n }));
vi.mock("./stylesheets/frontend.scss", () => ({}));
vi.mock("@assemblyvoting/electa-ui", () => ({ default: mocks.uiLibrary }));
vi.mock("@assemblyvoting/electa-ui/styles", () => ({}));

describe("main", () => {
  it(
    "bootstraps the app and mounts it once the router is ready",
    {
      timeout: 30000,
    },
    async () => {
      const loading = import("./main");

      // Let the module evaluate up to the top-level `await router.isReady()`.
      // Module transformation can be slow (e.g. under coverage), hence the timeout.
      await vi.waitFor(() => expect(mocks.router.isReady).toHaveBeenCalled(), {
        timeout: 20000,
      });

      expect(mocks.createApp).toHaveBeenCalledTimes(1);
      expect(mocks.createApp).toHaveBeenCalledWith(mocks.App);

      expect(mocks.app.use.mock.calls).toEqual([
        [mocks.uiLibrary, mocks.i18n],
        [mocks.pinia],
        [mocks.router],
        [mocks.i18n],
      ]);
      expect(mocks.router.isReady).toHaveBeenCalledTimes(1);
      expect(mocks.app.mount).not.toHaveBeenCalled();

      mocks.resolveReady();
      await loading;

      expect(mocks.app.mount).toHaveBeenCalledTimes(1);
      expect(mocks.app.mount).toHaveBeenCalledWith("#dbas-client");
    },
  );

  it("registers a v-focus directive that focuses the element on mount", async () => {
    mocks.resolveReady();
    await import("./main");

    expect(Object.keys(mocks.directives)).toEqual(["focus"]);

    const el = { focus: vi.fn() };
    mocks.directives.focus.mounted(el);

    expect(el.focus).toHaveBeenCalledTimes(1);
  });
});
