import { setupServer } from "msw/node";

import { handlersBook } from "./handlers";

const handlers = [...handlersBook];

export const server = setupServer(...handlers);
