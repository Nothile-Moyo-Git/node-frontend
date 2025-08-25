import { act } from "react-dom/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { server } from "./test-utils/mockServer";
import "@testing-library/jest-dom";

// Importing mocks to be used for testing
import "./test-utils/setupTestMocks";
import { setAppStateMock } from "./test-utils/setupTestMocks";
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";
import { mockContext } from "./test-utils/objects/objects";

// Component imports, we do this here
import { renderWithContext, renderWithRouter } from "./test-utils/testRouter";
import { generateUploadDate } from "./util/util";
import { mockUser } from "./test-utils/objects/objects";
import App from "./App";

// Two weeks after original expiry date
const mockExpiryDate = generateUploadDate(
  new Date(Date.now() + 12096e5).toISOString(),
);

const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

// Setup mocks and environment
beforeEach(() => {
  server.listen();
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

  it("Should show loading state", () => {
    renderWithRouter(<App />);
    const loadingIndicator = screen.getByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Should not show loading spinner is app loaded successfully", () => {
    setAppStateMock(false, false, mockUser, mockExpiryDate, mockCreationDate);

    renderWithRouter(<App />);

    const loadingIndicator = screen.queryByTestId("test-id-loading-spinner");
    expect(loadingIndicator).not.toBeInTheDocument();
  });

  it("Should show error modal if app isn't loaded successfully", async () => {
    setAppStateMock(false, true, mockUser, mockExpiryDate, mockCreationDate);

    renderWithRouter(<App />);

    const loadingIndicator = await screen.findByTestId("test-id-error-modal");
    expect(loadingIndicator).toBeVisible();
  });

  it("Show user details", async () => {
    // Mock context state and mock the fetch request
    mockContext.validateAuthentication = jest.fn();

    // Base state
    setAppStateMock(false, false, mockUser, mockExpiryDate, mockCreationDate);

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

    // Wait for loading spinner to disappear
    await waitFor(() => {
      expect(
        screen.queryByTestId("test-id-loading-spinner"),
      ).not.toBeInTheDocument();
      // expect(screen.getByTestId("test-id-user-exists")).toBeInTheDocument();
    });
  });
});
