require("@testing-library/jest-dom");
const { TextEncoder, TextDecoder } = require("node:util");
const { ReadableStream, TransformStream } = require("node:stream/web");
const { MessagePort } = require("worker_threads");
const { Blob } = require("buffer");
const DOMException = require("domexception");
import { jest } from "@jest/globals";
import "./src/test-utils/mockSocket";

// Setting global values for Jest testing
if (!String.prototype.toWellFormed) {
  String.prototype.toWellFormed = function () {
    return this.toString();
  };
}

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
    callback();
    return {
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      updateCallbackDone: Promise.resolve(),
      skipTransition: () => {},
      key: "mock-transition-key",
    };
  },
  writable: true,
});

// Mock our window object, with the necessary variables, we use writable because it allows us to update read-only values
Object.defineProperties(window, {
  location: {
    value: { reload: jest.fn() },
    writable: true,
  },
  alert: {
    value: jest.fn(),
    writable: true,
  },
});
