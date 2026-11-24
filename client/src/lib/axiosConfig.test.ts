import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxiosError, type AxiosResponse } from "axios";
import { HttpError } from "../Types";

const httpErrorHandlerMock = vi.hoisted(() => vi.fn());

vi.mock("./httpErrorHandler", () => ({ default: httpErrorHandlerMock }));

const { responseHandler, responseErrorHandler } = await import("./axiosConfig");

function makeResponse(
  overrides: Partial<AxiosResponse<any>> & { raw?: boolean } = {},
): AxiosResponse<any> {
  const { raw, ...rest } = overrides;
  return {
    data: undefined,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { raw } as any,
    ...rest,
  } as AxiosResponse<any>;
}

describe("responseHandler", () => {
  it("returns the full response when the request is raw", () => {
    const response = makeResponse({ raw: true, status: 500 });
    expect(responseHandler(response)).toBe(response);
  });

  it("returns the data for a 200 response", () => {
    const data = { hello: "world" };
    expect(responseHandler(makeResponse({ data }))).toBe(data);
  });

  it("throws an HttpError for a 200 response without data", () => {
    const run = () => responseHandler(makeResponse({ data: null }));
    expect(run).toThrow(HttpError);
    expect(run).toThrow("API Error. No data!");
  });

  it("returns undefined for a 204 response", () => {
    expect(
      responseHandler(makeResponse({ status: 204, data: "ignored" })),
    ).toBeUndefined();
  });

  it("throws an HttpError for any other status code", () => {
    const run = () =>
      responseHandler(makeResponse({ status: 302, data: { a: 1 } }));
    expect(run).toThrow(HttpError);
    expect(run).toThrow("API Error! Invalid status code!");
  });
});

describe("responseErrorHandler", () => {
  beforeEach(() => {
    httpErrorHandlerMock.mockReset();
  });

  // Axios passes an AxiosError (carrying the request config and the response)
  // to the rejection handler.
  function makeError(raw?: boolean) {
    const response = makeResponse({ raw, status: 500 });
    const error = new AxiosError(
      "Request failed with status code 500",
      AxiosError.ERR_BAD_RESPONSE,
      response.config,
      {},
      response,
    );
    return { error, response };
  }

  it("resolves raw requests with the error's response", () => {
    const { error, response } = makeError(true);

    expect(responseErrorHandler(error)).toBe(response);
    expect(httpErrorHandlerMock).not.toHaveBeenCalled();
  });

  it("delegates other requests to the http error handler", () => {
    const { error } = makeError();
    httpErrorHandlerMock.mockReturnValue("handled");

    expect(responseErrorHandler(error)).toBe("handled");
    expect(httpErrorHandlerMock).toHaveBeenCalledWith(error);
  });

  it("delegates errors without a request config to the http error handler", () => {
    const error = new Error("boom") as AxiosError;

    responseErrorHandler(error);

    expect(httpErrorHandlerMock).toHaveBeenCalledWith(error);
  });
});
