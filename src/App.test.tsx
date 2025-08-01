import { expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";
import { server } from "./mocks/Server";

// Importing mocks to be used for testing
import "./mocks/SetupMocks.test";
import { RoutedAppComponent } from "./mocks/Router";
import { RouterProvider } from "react-router-dom";

// Setup mocks and environment
beforeEach(() => server.listen());

// Cleanup mocks and environment
afterEach(() => server.resetHandlers());

afterAll(() => server.close());

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
