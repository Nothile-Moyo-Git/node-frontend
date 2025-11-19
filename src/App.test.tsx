/**
 * Author: Nothile Moyo
 * Date created: 27/08/2025
 *
 * @description: This is the test file for the App file, it handles the basic authentication and handling the user request
 */

import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

// Importing mocks to be used for testing
import "./test-utils/setupTestMocks";
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";
import { mockContext } from "./test-utils/mocks/objects";
import { createFetchResponse } from "./test-utils/methods/methods";

// Component imports, we do this here
import { renderWithContext, renderWithRouter } from "./test-utils/testRouter";
import { generateUploadDate } from "./util/util";
import { mockUser } from "./test-utils/mocks/objects";
import App from "./App";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Two weeks after original expiry date
const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());
let mockNavigate = jest.fn();

beforeEach(() => {
  setMockAuthStorage();
  mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

describe("App Component Tests", () => {
  // Handle the main authentication of the app
  it("Renders the app successfully", () => {
    renderWithRouter(<App />);

    // Check if the app component is rendered and we navigate to it successfully
    const appComponent = screen.getByTestId("test-id-app-component");
    expect(appComponent).toBeDefined();
    expect(appComponent).toMatchSnapshot();
  });

  it("Should show loading spinner", async () => {
    // Make the request never resolve so the loading spinner keeps spinning
    global.fetch = jest.fn(() => new Promise(() => {}));

    // Pass the context through so we can handle authentication requests
    renderWithContext(<App />, { route: "/" }, mockContext);

    const loadingIndicator = await screen.findByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Should not show loading spinner is app loaded successfully", async () => {
    // Mock a successful request to fetch user data which hides the loading spinner
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            PostUserDetailsResponse: {
              sessionCreated: mockCreationDate,
              sessionExpires: mockExpiryDate,
              user: mockUser,
              success: true,
            },
          },
        }),
    });

    renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => {
      const loadingIndicator = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingIndicator).not.toBeInTheDocument();
    });
  });

  it("Should show error modal if app isn't loaded successfully", async () => {
    // Mock a successful request which fails to show user data and isntead shows the error modal
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            PostUserDetailsResponse: {
              sessionCreated: mockCreationDate,
              sessionExpires: mockExpiryDate,
              user: mockUser,
              success: false,
            },
          },
        }),
    });

    renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");

      expect(errorModal).toBeVisible();
      expect(loadingSpinner).not.toBeInTheDocument();
    });
  });

  it("Show user details", async () => {
    renderWithContext(<App />, { route: "/" }, mockContext);

    // Wait for loading spinner to disappear and user details to render
    // We have to use a waitFor here since we're mocking the api reques
    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      const userText = screen.getByText(/Welcome Nothile Moyo/);

      expect(loadingSpinner).not.toBeInTheDocument();
      expect(userText).toBeInTheDocument();
    });
  });

  it("Handles a failed authentication request", async () => {
    // Mock a successful request which fails to show user data and isntead shows the error modal
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: false,
          },
        },
      }),
    );

    mockContext.validateAuthentication = jest.fn(() => {
      throw new Error("Auth failed");
    });

    renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      expect(errorModal).toBeVisible();
    });
  });

  it("Redirects to login if user is not authenticated", async () => {
    const context = {
      ...mockContext,
      userAuthenticated: false,
    };

    renderWithContext(<App />, { route: "/" }, context);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

// These are the extra tests simply to meet code coverage standards as an experiment
// This won't be repeated across other tests and it doesn't serve any purpose other than the feel good feeling
describe("App Component Tests - Coverage Tests", () => {
  it("Does NOT call checkSessionValidation if user has no token", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
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

    const context = {
      ...mockContext,
      userId: "123",
      token: undefined,
    };

    renderWithContext(<App />, { route: "/" }, context);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("Skips both API calls if userAuthenticated is true but no userId", async () => {
    const context = {
      ...mockContext,
      userAuthenticated: true,
      userId: undefined,
    };

    renderWithContext(<App />, { route: "/" }, context);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("Does NOT set loadingError if error is falsy", async () => {
    mockContext.validateAuthentication = jest.fn(() => {
      throw null;
    });

    renderWithContext(<App />, { route: "/" }, mockContext);

    await waitFor(() => {
      expect(screen.queryByTestId("test-id-error-modal")).toBeNull();
    });
  });

  it("Redirects to login if token exists but user is not authenticated", async () => {
    const context = {
      ...mockContext,
      userAuthenticated: false,
      token: "abc123",
      userId: "123",
    };

    renderWithContext(<App />, { route: "/" }, context);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
