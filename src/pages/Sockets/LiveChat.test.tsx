/**
 * Author: Nothile Moyo
 * Date created: 31/03/2026
 *
 * @description: This is the test file for the live chat component
 * This is to mock the live chat functionality with websockets
 */

import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";

// Assign values so we can mock key functionality in jest instead of actually using components of performing requests
let mockFetch: jest.MockedFunction<typeof fetch>;
const socketEventHandlers: Record<string, (_data: unknown) => void> = {};
const originalEnv = process.env;

// We need to mock our client as we have to use it for a successful redirect
jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: jest.fn((event: string, handler: (_data: unknown) => void) => {
      socketEventHandlers[event] = handler;
    }),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
}));

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  setMockAuthStorage();

  // Create a new copy of process.env so we an update it
  process.env = { ...originalEnv };
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
  jest.clearAllMocks();

  // Reset our process variable
  process.env = originalEnv;
});

describe("Live Chat component", () => {
  it("Should match snapshot", async () => {});
});
