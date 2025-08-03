import { expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";
import { server } from "./test-utils/mockServer";

// Importing mocks to be used for testing
import "./test-utils/setupTestMocks";
import { RoutedAppComponent } from "./test-utils/testRouter";
import { RouterProvider } from "react-router-dom";
import { setIsLoadingMock } from "./test-utils/setupTestMocks";

// Setup mocks and environment
beforeEach(() => server.listen());

// Cleanup mocks and environment
afterEach(() => server.resetHandlers());

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

    setIsLoadingMock(false);

    const loadingIndicator = screen.getByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeDefined();
  });
});
