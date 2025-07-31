import { setupServer } from "msw/node";
import { handlers } from "./Request.test";

export const server = setupServer(...handlers);
