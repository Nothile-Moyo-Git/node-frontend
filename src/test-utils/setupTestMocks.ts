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
  // Call the state in the same order but ensure that our initial values aren't set multiple times
  let hasSetLoading = false;
  let hasSetUser = false;
  const hasSetExpiry = false;

  mockedUseState.mockImplementation((init) => {
    if (typeof init === "boolean" && !hasSetLoading) {
      hasSetLoading = true;
      return [isLoading, setMockState];
    }
    if (typeof init === "boolean") {
      return [loadingError, setMockState];
    }
    if (init === undefined && !hasSetUser) {
      hasSetUser = true;
      return [user, setMockState];
    }
    /* if (typeof init === "string" && !hasSetExpiry) {
      hasSetExpiry = true;
      return [sessionExpiryDate, setMockState];
    }
    if (typeof init === "string") {
      return [sessionCreationDate, setMockState];
    } */
    return [init, setMockState];
  });
};
