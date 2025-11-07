/**
 *
 * Date created: 07/11/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Mock the socket.io instance without using jest.mock in our setup file as it won't be read
 */

import { jest } from "@jest/globals";

export const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  removeAllListeners: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock("socket.io-client", () => {
  return {
    io: () => mockSocket,
  };
});
