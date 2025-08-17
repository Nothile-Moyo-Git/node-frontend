require("@testing-library/jest-dom");
const { TextEncoder, TextDecoder } = require("node:util");
const { ReadableStream, TransformStream } = require("node:stream/web");
const { MessagePort } = require("worker_threads");
const { Blob } = require("buffer");
const DOMException = require("domexception");

// Setting global values for Jest testing

// Set globals before undici so we can use TextEncoder and TextDecoder, otherwise they're not defined
// These values need to be defined at require time
Object.defineProperties(global, {
  MessagePort: { value: MessagePort },
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  Blob: { value: Blob },
  DOMException: { value: DOMException },
});

const { fetch, Headers, Request, Response } = require("undici");

// Set the globalThis values for API requests
Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Headers: { value: Headers },
  Request: { value: Request },
  Response: { value: Response },
});

// Mock the View Transitions API so React Router won't crash
Object.defineProperty(document, "startViewTransition", {
  value: (callback) => {
    // just run the callback immediately in tests
    callback();
    return {
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      updateCallbackDone: Promise.resolve(),
    };
  },
  writable: true,
});
