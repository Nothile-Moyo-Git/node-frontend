/**
 * Author: Nothile Moyo
 * Date created: 27/08/2025
 *
 * @description: This is the test file for the App file, it handles the basic authentication and handling the user request
 */

import { act } from "react-dom/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { server } from "./test-utils/mockServer";
import "@testing-library/jest-dom";

// Importing mocks to be used for testing
import "./test-utils/setupTestMocks";
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";
import { mockContext } from "./test-utils/mocks/objects";

// Component imports, we do this here
import { renderWithContext, renderWithRouter } from "./test-utils/testRouter";
import { generateUploadDate } from "./util/util";
import { mockUser } from "./test-utils/mocks/objects";
import App from "./App";

// Two weeks after original expiry date
const mockExpiryDate = generateUploadDate(
  new Date(Date.now() + 12096e5).toISOString(),
);

const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

// Setup mocks and environment
beforeAll(() => server.listen());

beforeEach(() => {
  setMockAuthStorage();
});

// Cleanup mocks and environment
afterEach(() => {
  server.resetHandlers();
  clearAuthStorage();
});

afterAll(() => server.close());

describe("App Component Tests", () => {
  // Handle the main authentication of the app
  it("Renders the app successfully", () => {
    act(() => {
      renderWithRouter(<App />);
    });

    // Check if the app component is rendered and we navigate to it successfully
    const appComponent = screen.getByTestId("test-id-app-component");
    expect(appComponent).toBeDefined();
    expect(appComponent).toMatchSnapshot();
  });

  it("Should show loading spinner", async () => {
    renderWithRouter(<App />);

    const loadingIndicator = screen.getByTestId("test-id-loading-spinner");
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
});
