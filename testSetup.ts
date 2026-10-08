/// <reference types="vitest/globals" />
import { server } from "@mocks/server";

/**
 * @info Enables the interception of requests in the current process.
 * @see https://mswjs.io/docs/api/setup-server/listen
 */
beforeAll(() =>
  server.listen({
    /**
     * @info This tells MSW to throw an error whenever it encounters a request,
     * @info that doesn't have a matching request handler.
     */
    onUnhandledRequest: "error",
  })
);

/**
 * @info The server.resetHandlers() method can be called without any arguments. When done so,
 * @info all the Runtime request handlers (those prepended via server.use()) will be removed.
 * @see https://mswjs.io/docs/api/setup-server/reset-handlers
 */
afterEach(() => server.resetHandlers());

/**
 * @info This method is designed to be called when the API mocking capabilities are no longer needed,
 * @info for example when the test run is finished.
 * @see https://mswjs.io/docs/api/setup-server/listen
 */
afterAll(() => server.close());

if (typeof globalThis.crypto?.randomUUID !== "function") {
  vi.stubGlobal("crypto", {
    randomUUID: () => "test-uuid-1234",
  });
}
