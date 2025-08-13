/**
 * Date created: 30/07/2025
 *
 * Author: Nothile
 *
 * Methods test file, this file defines reusable methods and hooks which can be used across my tests
 * These methods are intended to be used to replicate the official functionality of the app
 *
 */

import { useState } from "react";
import { User } from "../@types";

// Mock useNavigate so it works with jest
export const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

// This allows us to be able to mock hooks in Jest otherwise we use the actual hook which triggers errors
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

// Cast since we're using a ts file and we want to manipulate this
const mockedUseState = useState as jest.Mock;

const setMockState = jest.fn();

// Default mock implementation of usestate
mockedUseState.mockImplementation((init) => [init, setMockState]);

// Utility function to update mocked isLoading in tests
export const setAppStateMock = (
  isLoading: boolean,
  loadingError: boolean,
  user: User | undefined,
  sessionExpiryDate: string | undefined,
  sessionCreationDate: string | undefined,
) => {
  // Track the amount of times we use useState, this is because the order has to match the state in App
  let callCount = 0;

  mockedUseState.mockImplementation((init) => {
    switch (callCount) {
      case 0:
        callCount++;
        return [isLoading, setMockState];
      case 1:
        callCount++;
        return [loadingError, setMockState];
      case 2:
        callCount++;
        return [user, setMockState];
      case 3:
        callCount++;
        return [sessionExpiryDate, setMockState];
      case 4:
        callCount++;
        return [sessionCreationDate, setMockState];
      default:
        callCount++;
        return [init, setMockState];
    }
    /* if (typeof init === "boolean" && callCount === 0) {
      callCount++;
      return [isLoading, setMockState];
    }
    return [init, setMockState]; */
  });
};
