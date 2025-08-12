import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";
import { server } from "./test-utils/mockServer";
import "@testing-library/jest-dom";

// Importing mocks to be used for testing
import "./test-utils/setupTestMocks";
import { setIsLoadingMock } from "./test-utils/setupTestMocks";
import { clearAuthStorage, setMockAuthStorage } from "./test-utils/authStorage";

// Component imports, we do this here
import { RoutedAppComponent } from "./test-utils/testRouter";
import { RouterProvider } from "react-router-dom";
import { User } from "./@types";

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
      render(<RouterProvider router={RoutedAppComponent} />);
    });

    // Check if the app component is rendered and we navigate to it successfully
    const appComponent = screen.getByTestId("testid-app-component");
    expect(appComponent).toBeDefined();
    expect(appComponent).toMatchSnapshot();
  });

  it("Should show loading state", () => {
    render(<RouterProvider router={RoutedAppComponent} />);

    const loadingIndicator = screen.getByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Should not show loading spinner is app loaded successfully", () => {
    setIsLoadingMock(false);

    render(<RouterProvider router={RoutedAppComponent} />);

    const loadingIndicator = screen.queryByTestId("test-id-loading-spinner");
    expect(loadingIndicator).not.toBeInTheDocument();
  });

  it("Show user details", () => {
    setIsLoadingMock(false);
    setIsLoadingMock(mockUser);

    render(<RouterProvider router={RoutedAppComponent} />);

    const loadingIndicator = screen.queryByTestId("test-id-loading-spinner");
    expect(loadingIndicator).not.toBeInTheDocument();

    const welcomeText = screen.getByText("Welcome");

    expect(welcomeText).toBeInTheDocument();
  });
});
