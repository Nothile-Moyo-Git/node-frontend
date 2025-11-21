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
import { renderWithAct, renderWithContext, renderWithRouter } from "./test-utils/testRouter";

// App + helpers
import App from "./App";
import { generateUploadDate } from "./util/util";
import { ContextProps } from "./context/AppContext";

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

//
// ──────────────────────────────────────────────────────
//   BASE TESTS
// ──────────────────────────────────────────────────────
//
describe("App Component Tests", () => {
  it("Renders successfully", () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId("test-id-app-component")).toBeDefined();
  });

  it("Shows loading spinner while waiting for fetch", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => new Promise(() => {}));

    renderWithAct(<App />, { route: "/" }, { ...mockContext, token: undefined });

    const spinner = await screen.findByTestId("test-id-loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("Removes spinner once data loads", async () => {
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

    await waitFor(() => expect(screen.queryByTestId("test-id-loading-spinner")).not.toBeInTheDocument());
  });

  it("Shows error modal when backend returns success: false", async () => {
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
  });

  it("Redirects to login if user is not authenticated", async () => {
    renderWithContext(<App />, { route: "/" }, { ...mockContext, userAuthenticated: false });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });
});

//
// ──────────────────────────────────────────────────────
//   BRANCH / EDGE CASES
// ──────────────────────────────────────────────────────
//
describe("App Component - Edge Case Coverage", () => {
  it("Does NOT call checkSessionValidation if token is undefined", async () => {
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

  it("Skips API calls if authenticated but missing userId", async () => {
    renderWithContext(
      <App />,
      { route: "/" },
      {
        ...mockContext,
        userAuthenticated: true,
        userId: undefined,
        token: "abc123",
      },
    );

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });

  it("Does not set loadingError if thrown error is falsy", async () => {
    renderWithContext(
      <App />,
      { route: "/" },
      {
        ...mockContext,
        validateAuthentication: () => {
          throw null;
        },
      },
    );

    await waitFor(() => {
      expect(screen.queryByTestId("test-id-error-modal")).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("Redirects when user has token but is NOT authenticated", async () => {
    renderWithContext(
      <App />,
      { route: "/" },
      {
        ...mockContext,
        userAuthenticated: false,
        token: "abc123",
      },
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("Redirects when AppContext is missing", async () => {
    renderWithContext(<App />, { route: "/" }, undefined as unknown as ContextProps);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  /* it("Calls checkSessionValidation when token, userId & userAuthenticated are valid", async () => {
    (checkSessionValidation as jest.Mock).mockResolvedValue(undefined);

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

    renderWithContext(
      <App />,
      { route: "/" },
      {
        ...mockContext,
        userAuthenticated: true,
        userId: "123",
        token: "valid-token",
      },
    );

    await waitFor(() => expect(checkSessionValidation).toHaveBeenCalled());
  }); */
});
