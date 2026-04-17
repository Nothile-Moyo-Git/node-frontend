/**
 *
 * Date created: 07/11/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Mock the socket.io instance without using jest.mock in our setup file as it won't be read
 * We mock our modules here so they can be imported via jest at the beginning of our tests instead of being defined in each test
 *
 * If you wish to reset the modules, or update the imports, use jest.resetModules in the test and import it from there
 * This code is to reduce duplication
 */

import { jest } from "@jest/globals";

export const socketEventHandlers: Record<string, (_data: unknown) => void> = {};

jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: jest.fn((event: string, handler: (_data: unknown) => void) => {
      socketEventHandlers[event] = handler;
    }),
    emit: jest.fn(),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
}));
