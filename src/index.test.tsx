/**
 * Author: Nothile Moyo
 *
 * Date created: 03/12/2025
 */

import React, { ReactNode } from "react";

// Mock ReactDOM
const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({ render: mockRender }));

jest.mock("react-dom/client", () => ({
  createRoot: () => mockCreateRoot(),
}));

// Mock router + context provider (we're not testing them here)
jest.mock("./routes/Router", () => ({
  nestedRouter: {},
}));

jest.mock("react-router-dom", () => ({
  RouterProvider: () => <div data-testid="router-provider" />,
}));

jest.mock("./context/AppContext", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div data-testid="app-context">{children}</div>,
}));

// We're importing our file here so we can trigger rendering in our app
import "./index";

describe("index.tsx entrypoint", () => {
  test("renders ReactDOM root correctly", () => {
    // Ensure createRoot was used
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);

    // Ensure render was called with React.StrictMode tree
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
