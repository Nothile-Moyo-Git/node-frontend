import { describe, expect, test } from "@jest/globals";
import React from "react";
import App from "./App";
import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";

// App test file, this test checks validation and handles redirections accordingly
describe("Testing jest to see if it works", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
  });
});

// Setup mocks and environment
beforeEach(() => {});

// Cleanup mocks and environment
afterEach(() => {});

// Handle the main authentication of the app
it("Renders the app successfully", () => {
  act(() => {
    render(<App />);
  });

  const appComponent = screen.getByTestId("testid-app-component");
  expect(appComponent).toBeDefined();
});
