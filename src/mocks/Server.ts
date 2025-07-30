import { setupServer } from "msw/node";
import { handlers } from "./requests.test";

export const server = setupServer(...handlers);
