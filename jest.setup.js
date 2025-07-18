require("@testing-library/jest-dom");
const { fetch, Headers, Request, Response } = require("undici");

globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;
