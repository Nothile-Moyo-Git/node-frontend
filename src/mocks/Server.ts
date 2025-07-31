import { setupServer } from "msw/node";
import { handlers } from "./Requests.test";

export const server = setupServer(...handlers);
