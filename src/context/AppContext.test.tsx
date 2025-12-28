/**
 * Date created: 22/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the appContext
 */

import { useContext } from "react";
import AppContextProvider, { AppContext, ContextProps } from "./AppContext";
import { render } from "@testing-library/react";
import { mockContext } from "../test-utils/mocks/objects";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clearAuthStorage, setMockAuthStorage } from "../test-utils/authStorage";

// Create a copy of our original process.env so we can update it test by test
const originalEnv = process.env;

beforeEach(() => {
  setMockAuthStorage();
  // Reset our modules so we can set onew environment variables
  jest.resetModules();
  // Create a new copy of process.env so we an update it
  process.env = { ...originalEnv };
});

afterEach(() => {
  clearAuthStorage();
  jest.clearAllMocks();
  process.env = originalEnv;
});

describe("AppContext", () => {
  // Instantiate our context and create a child to pass it through, that way, we can test everything
  const Children = () => {
    const appContextInstance: ContextProps = useContext(AppContext);

    return (
      <section>
        <div>
          <p data-testid="test-id-token-value">Token: {appContextInstance.token}</p>
          <p data-testid="test-id-userid-value">UserId: {appContextInstance.userId}</p>
          <p data-testid="test-id-authentication-value">Authenticated: {appContextInstance.userAuthenticated}</p>
        </div>
        <div>
          <button data-testid="test-id-validate-button" onClick={appContextInstance.validateAuthentication}>
            Validate Authentication
          </button>
          <button data-testid="test-id-check-button" onClick={appContextInstance.checkAuthentication}>
            Check Authentication
          </button>
          <button data-testid="test-id-logout-button" onClick={appContextInstance.logoutUser}>
            Logout
          </button>
        </div>
      </section>
    );
  };

  it("Renders the default context", () => {
    // Render an empty component
    const { baseElement } = render(<AppContext.Provider value={mockContext}>{<Children />}</AppContext.Provider>);

    // Check to make sure we see the buttons
    const validateButton = screen.getByTestId("test-id-validate-button");
    const checkAuthenticationButton = screen.getByTestId("test-id-check-button");
    const logoutButton = screen.getByTestId("test-id-logout-button");
    expect(validateButton).toBeVisible();
    expect(checkAuthenticationButton).toBeVisible();
    expect(logoutButton).toBeVisible();

    // Check if it matches the snapshot
    expect(baseElement).toMatchSnapshot();
  });

  it("Calls the checkAuthentication method passed through", async () => {
    // Render an empty component
    const { baseElement } = render(<AppContextProvider>{<Children />}</AppContextProvider>);

    // Check to make sure we see the buttons
    const checkAuthenticationButton = screen.getByTestId("test-id-check-button");

    // Click on the checkAuthentication button
    userEvent.click(checkAuthenticationButton);

    // Check if it matches the snapshot
    expect(baseElement).toMatchSnapshot();
  });

  it("Calls validateAuthentication with an environment of dev", () => {
    // Mock the environment variables
    // This is so we can test dev and prod environment variables in the context
    // This allows us to update read-only properties
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
      REACT_APP_API_DEV: {
        value: "development",
        writable: true,
        configurable: true,
      },
      REACT_APP_API_PROD: {
        value: "production",
        writable: true,
        configurable: true,
      },
    });

    // Render an empty component
    const { baseElement } = render(<AppContextProvider>{<Children />}</AppContextProvider>);

    // Check to make sure we see the buttons
    const validateButton = screen.getByTestId("test-id-validate-button");
    userEvent.click(validateButton);

    // Check if it matches the snapshot
    expect(baseElement).toMatchSnapshot();
  });
});
