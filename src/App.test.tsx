import { expect } from "@jest/globals";
import React from "react";
import App from "./App";
import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";

// Mock useNavigate so it works with jest
export const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

// Setup mocks and environment
beforeEach(() => {});

// Cleanup mocks and environment
afterEach(() => {});

// Handle the main authentication of the app
it("Renders the app successfully", () => {
  act(() => {
    render(<App />);
  });

  // Check if the app component is rendered and we navigate to it successfully
  const appComponent = screen.getByTestId("testid-app-component");
  expect(appComponent).toBeDefined();
});
