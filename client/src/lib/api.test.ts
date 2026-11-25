import "../test-utils/setupConfig";
import { describe, it, expect } from "vitest";
import { api, options } from "./api";

describe("api", () => {
  it("uses the DBB URL from the runtime config as base URL", () => {
    expect(options).toEqual({ baseURL: "http://dbb.localhost:3003" });
  });

  it("exposes an axios instance configured with those options", () => {
    expect(typeof api.get).toBe("function");
    expect(api.defaults.baseURL).toBe("http://dbb.localhost:3003");
  });
});
