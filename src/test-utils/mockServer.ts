import { setupServer } from "msw/node";
import { handlers } from "./authHandlers";

export const server = setupServer(...handlers);
