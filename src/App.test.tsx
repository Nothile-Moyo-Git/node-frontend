import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/react";
import { server } from "./test-utils/mockServer";
import "@testing-library/jest-dom";

// Importing mocks to be used for testing
import "./test-utils/setupTestMocks";
import { setAppStateMock } from "./test-utils/setupTestMocks";
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";

// Component imports, we do this here
import { renderWithRouter } from "./test-utils/testRouter";
import { User } from "./@types";
import { generateUploadDate } from "./util/util";
import App from "./App";

// Define a user here which should have their details rendered on the main App page
const mockUser: User = {
  _id: "Nothile Moyo",
  name: "",
  email: "nothile1@gmail.com",
  password: "test",
  status: "active",
  posts: [
    "662423764e8c8b1633534be8",
    "662423884e8c8b1633534bf0",
    "662e7bcdd94fde36bf4bb554",
    "662e7c6ad94fde36bf4bb55c",
    "67843561d02db477bac4843b",
  ],
};

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

  it("Show user details", () => {
    setAppStateMock(false, false, mockUser, mockExpiryDate, mockCreationDate);

    renderWithRouter(<App />);

    const loadingIndicator = screen.queryByTestId("test-id-loading-spinner");
    expect(loadingIndicator).not.toBeInTheDocument();

    const welcomeText = screen.queryByTestId("test-id-user-exists");

    expect(welcomeText).toBeInTheDocument();
  });
});
