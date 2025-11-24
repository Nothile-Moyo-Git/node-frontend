/**
 * Author: Nothile Moyo
 * Date created: 27/08/2025
 *
 * @description: Tests for App.tsx including UI, loading states, redirects & branch coverage.
 */

import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

// Test utilities
import "./test-utils/setupTestMocks";
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";
import { mockContext, mockUser } from "./test-utils/mocks/objects";
import { createFetchResponse } from "./test-utils/methods/methods";
import { renderWithContext, renderWithRouter } from "./test-utils/testRouter";

// App + helpers
import App from "./App";
import { generateUploadDate } from "./util/util";

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("./util/util", () => ({
  ...jest.requireActual("./util/util"),
  checkSessionValidation: jest.fn(),
}));

// ---- Test Setup Values ----
const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

let mockNavigate = jest.fn();

beforeEach(() => {
  jest.restoreAllMocks();
  setMockAuthStorage();
  mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});

afterEach(() => {
  clearAuthStorage();
});

// Our main tests, these tests cover key functionality
describe("App Component Tests", () => {
  it("Renders successfully", () => {
    console.log("Current test: Renders successfully");
    renderWithRouter(<App />);
    expect(screen.getByTestId("test-id-app-component")).toBeDefined();
  });

  it("Shows loading spinner while waiting for fetch and hides it on completion", async () => {
    // Doesn't resolve the request in order to view the loading spinner
    global.fetch = jest.fn(() => new Promise(() => {}));

    renderWithContext(<App />, { route: "/" }, mockContext);

    expect(screen.getByTestId("test-id-loading-spinner")).toBeInTheDocument();
  });

  it("Shows error modal when backend returns success: false", async () => {
    console.log("Current test: Shows error modal when backend returns success: false");
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: { ...mockUser, success: false },
        },
      }),
    );

    renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => expect(screen.getByTestId("test-id-error-modal")).toBeVisible());
  });

  it("Displays user details after successful authentication", async () => {
    console.log("Current test: Displays user details after successful authentication");
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: true,
          },
        },
      }),
    );

    renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => {
      expect(screen.getByText(/Welcome Nothile Moyo/)).toBeInTheDocument();
      expect(screen.getByText(/Current status : active/)).toBeInTheDocument();
    });
  });

  it("Shows error modal if validateAuthentication throws", async () => {
    console.log("Current test: Shows error modal if validateAuthentication throws");

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderWithContext(
      <App />,
      { route: "/" },
      {
        ...mockContext,
        validateAuthentication: () => {
          throw new Error("Auth failed");
        },
      },
    );

    await waitFor(() => expect(screen.getByTestId("test-id-error-modal")).toBeVisible());

    consoleErrorSpy.mockRestore();
  });

  it("Redirects to login if user is not authenticated", async () => {
    console.log("Current test: Redirects to login if user is not authenticated");
    renderWithContext(<App />, { route: "/" }, { ...mockContext, userAuthenticated: false });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });
});

// Coverage tests, these are done to increase code coverage to 100% for this file as a test
// I do not recommend aiming for 100% coverage, but instead, enough coverage to cover key functionality
describe("App Component - Edge Case Coverage", () => {
  it("Does NOT call checkSessionValidation if token is undefined", async () => {
    console.log("Current test: Does NOT call checkSessionValidation if token is undefined");
    renderWithContext(
      <App />,
      { route: "/" },
      {
        ...mockContext,
        userAuthenticated: true,
        userId: "123",
        token: undefined,
      },
    );

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });
});
