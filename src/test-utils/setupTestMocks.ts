/**
 * Date created: 30/07/2025
 *
 * Author: Nothile
 *
 * Methods test file, this file defines reusable methods and hooks which can be used across my tests
 * These methods are intended to be used to replicate the official functionality of the app
 *
 */

// Mock useNavigate so it works with jest
export const mockUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));
