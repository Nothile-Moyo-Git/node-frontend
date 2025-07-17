import { expect } from "@jest/globals";
import App from "./App";
import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";
import { server } from "./mocks/node";

// Importing mocks to be used for testing
import "./mocks/methods.test";

// Setup mocks and environment
beforeEach(() => server.listen());

// Cleanup mocks and environment
afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// Handle the main authentication of the app
it("Renders the app successfully", () => {
  act(() => {
    render(<App />);
  });

  // Check if the app component is rendered and we navigate to it successfully
  const appComponent = screen.getByTestId("testid-app-component");
  expect(appComponent).toBeDefined();

  // Make sure that the app matches the snapshot
  expect(appComponent).toMatchSnapshot();
});
