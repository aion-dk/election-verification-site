import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AxiosError } from "axios";
import handleHttpError from "./httpErrorHandler";

function axiosError(
  code: string,
  extra: { response?: { status: number }; request?: object } = {},
) {
  const error = new AxiosError("boom", code);
  if (extra.response) error.response = extra.response as any;
  if (extra.request) error.request = extra.request;
  return error;
}

describe("handleHttpError", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws an unrecoverable error when the error is null", () => {
    expect(() => handleHttpError(null)).toThrow(
      "Unrecoverable error!! Error is null!",
    );
  });

  it("logs network problems and rethrows the axios error", () => {
    const error = axiosError("ERR_NETWORK");
    expect(() => handleHttpError(error)).toThrow(error);
    expect(logSpy).toHaveBeenCalledWith("connection problems..");
  });

  it("logs canceled connections and rethrows the axios error", () => {
    const error = axiosError("ERR_CANCELED");
    expect(() => handleHttpError(error)).toThrow(error);
    expect(logSpy).toHaveBeenCalledWith("connection canceled..");
  });

  it("logs a not-found message for 404 responses", () => {
    const error = axiosError("ERR_BAD_REQUEST", { response: { status: 404 } });
    expect(() => handleHttpError(error)).toThrow(error);
    expect(logSpy).toHaveBeenCalledWith(
      "The requested resource does not exist or has been deleted",
    );
  });

  it("logs a login message for 401 responses", () => {
    const error = axiosError("ERR_BAD_REQUEST", { response: { status: 401 } });
    expect(() => handleHttpError(error)).toThrow(error);
    expect(logSpy).toHaveBeenCalledWith("Please login to access this resource");
  });

  it("rethrows other status codes without logging", () => {
    const error = axiosError("ERR_BAD_RESPONSE", {
      response: { status: 500 },
    });
    expect(() => handleHttpError(error)).toThrow(error);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("rethrows when a request was made but no response was received", () => {
    const error = axiosError("ECONNABORTED", { request: {} });
    expect(() => handleHttpError(error)).toThrow(error);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("rethrows axios errors with neither response nor request", () => {
    const error = axiosError("ERR_BAD_OPTION");
    expect(() => handleHttpError(error)).toThrow(error);
  });

  it("logs the message of non-axios errors without throwing", () => {
    expect(handleHttpError(new Error("plain failure"))).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith("plain failure");
  });
});
