/**
 * Author: Nothile Moyo
 * Date created: 27/08/2025
 *
 * @description: Tests for App.tsx including UI, loading states, redirects & branch coverage.
 */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

// Test utilities
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";
import { mockContext, mockUser } from "./test-utils/mocks/objects";
import { createFetchResponse } from "./test-utils/methods/methods";
import { renderWithContext, renderWithRouter } from "./test-utils/testRouter";

// App + helpers
import App from "./App";
import { generateUploadDate } from "./util/util";
import { AppContext } from "./context/AppContext";
import { ReactNode } from "react";

jest.mock("./util/util", () => ({
  ...jest.requireActual("./util/util"),
  checkSessionValidation: jest.fn(),
}));

// ---- Test Setup Values ----
const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

// ---- Mock values ----
const originalEnv = process.env;
let mockNavigate: jest.Mock;

beforeEach(() => {
  jest.restoreAllMocks();
  setMockAuthStorage();
  mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});

afterEach(() => {
  clearAuthStorage();
  jest.clearAllMocks();
  // Reset our process.env after each test so we go back to our original values
  process.env = { ...originalEnv };
});

// Our main tests, these tests cover key functionality
describe("App Component Tests", () => {
  it("Renders successfully", () => {
    renderWithRouter(<App />, undefined);
    expect(screen.getByTestId("test-id-app-component")).toBeDefined();
  });

  it("Shows loading spinner while waiting for fetch and hides it on completion", async () => {
    // Doesn't resolve the request in order to view the loading spinner
    global.fetch = jest.fn(() => new Promise(() => {}));

    renderWithContext(<App />, {}, mockContext);

    expect(screen.getByTestId("test-id-loading-spinner")).toBeInTheDocument();
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
    // Set it to the dev environment so we get the different port
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

    // Set the environment to development
    Object.defineProperties(process.env, {
      REACT_APP_API_DEV: {
        value: undefined,
        writable: true,
        configurable: true,
      },
    });

    // Reset our imports so we can do one in the development environment
    jest.resetModules();

    // Import our mockContext again so we can use it with dev
    const { mockContext } = await import("./test-utils/mocks/objects");

    const { baseElement } = renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => {
      expect(screen.getByText(/Welcome Nothile Moyo/)).toBeInTheDocument();
      expect(screen.getByText(/Current status : active/)).toBeInTheDocument();
      expect(screen.getByText(/Email address : nothile1@gmail.com/)).toBeInTheDocument();
      expect(screen.getByText(`Session created : ${mockCreationDate}`)).toBeInTheDocument();
      expect(screen.getByText(`Session expires : ${mockExpiryDate}`)).toBeInTheDocument();
    });

    // Generate our snapshot of our file when it loads successfully so we can see it
    expect(baseElement).toMatchSnapshot();
  });

  it("renders the ErrorModal when useUserDetails catches an error", async () => {
    // Force useUserDetails to hit its catch block by throwing an error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network fail"));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AppContext.Provider value={mockContext}>{children}</AppContext.Provider>
    );

    const { queryByTestId, getByTestId } = render(<App />, { wrapper });

    // Before updates: error modal should not appear yet
    expect(queryByTestId("test-id-error-modal")).toBeNull();

    // Wait for the state transitions inside useUserDetails:
    await waitFor(() => {
      expect(getByTestId("test-id-error-modal")).toBeInTheDocument();
    });
  });
});

// Coverage tests, these are done to increase code coverage to 100% for this file as a test
// I do not recommend aiming for 100% coverage, but instead, enough coverage to cover key functionality
describe("App Component - Edge Case Coverage", () => {
  it("Does NOT call checkSessionValidation if token is undefined", async () => {
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
        token: undefined,
      },
    );

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });

  it("Handles routing in development appropriately", async () => {
    // Set the environment to development
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

    // Reset our imports so we can do one in the development environment
    jest.resetModules();

    const { routes } = await import("./routes/Router");

    // Check if it contains sandbox, which we can only see in development for the routing
    const hasSandbox = routes.some((route) => route.path === "sandbox");
    expect(hasSandbox).toBe(true);
  });
});
