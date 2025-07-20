require("@testing-library/jest-dom");
const { TextEncoder, TextDecoder } = require("util");

// Setting global values for Jest testing

// Set globals before undici so we can use TextEncoder and TextDecoder, otherwise they're not defined
// These values need to be defined at require time
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

const { fetch, Headers, Request, Response } = require("undici");

// Set the globalThis values for API requests
if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = fetch;
}

if (typeof globalThis.Headers === "undefined") {
  globalThis.Headers = Headers;
}

if (typeof globalThis.Request === "undefined") {
  globalThis.Request = Request;
}

if (typeof globalThis.Response === "undefined") {
  globalThis.Response = Response;
}
