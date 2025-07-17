import "@testing-library/jest-dom";

import { fetch, Headers, Request, Response } from "undici";

globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;
