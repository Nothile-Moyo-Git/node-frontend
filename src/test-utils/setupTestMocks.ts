/// <reference types="jest" />

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

// Cast since we're using a ts file
const mockedUseState = useState as jest.Mock;

const setMockState = jest.fn();
mockedUseState.mockImplementation((init) => [init, setMockState]);
