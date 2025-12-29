/**
 * Date created: 22/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the appContext
 */

import React, { act, useContext } from "react";
import AppContextProvider, { AppContext, ContextProps } from "./AppContext";
import { render } from "@testing-library/react";
import { mockContext } from "../test-utils/mocks/objects";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clearAuthStorage, setMockAuthStorage } from "../test-utils/authStorage";

const Children = () => {
  const appContextInstance: ContextProps = useContext(AppContext);
  const [checkResult, setCheckResult] = React.useState<boolean | undefined>(undefined);

  // Allow us to test the response of the request
  const handleCheckAuthentication = () => {
    const result = appContextInstance.checkAuthentication();
    setCheckResult(result);
  };

  return (
    <section>
      <div>
        <p data-testid="test-id-token-value">Token: {appContextInstance.token}</p>
        <p data-testid="test-id-userid-value">UserId: {appContextInstance.userId}</p>
        <p data-testid="test-id-authentication-value">{`Authenticated: ${appContextInstance.userAuthenticated}`}</p>
        <p data-testid="test-id-check-result">{`Check Result: ${checkResult !== undefined ? checkResult : "not checked"}`}</p>
      </div>
      <div>
        <button data-testid="test-id-validate-button" onClick={appContextInstance.validateAuthentication}>
          Validate Authentication
        </button>
        <button data-testid="test-id-check-button" onClick={handleCheckAuthentication}>
          Check Authentication
        </button>
        <button data-testid="test-id-logout-button" onClick={appContextInstance.logoutUser}>
          Logout
        </button>
      </div>
    </section>
  );
};

describe("AppContext", () => {
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
    await act(async () => {
      userEvent.click(checkAuthenticationButton);
    });

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

    // Ensure that the user is validated
    const authenticatedText = screen.getByTestId("test-id-authentication-value");
    expect(authenticatedText).toHaveTextContent("Authenticated: true");

    // Check if it matches the snapshot
    expect(baseElement).toMatchSnapshot();
  });

  it("Logs out the user", async () => {
    // Render an empty component
    render(<AppContextProvider>{<Children />}</AppContextProvider>);

    // Check to make sure we see the buttons
    const logoutButton = screen.getByTestId("test-id-logout-button");
    await act(async () => {
      userEvent.click(logoutButton);
    });

    // Make sure we no longer have anything in localStorage
    const tokenText = screen.getByTestId("test-id-token-value");
    const userIdText = screen.getByTestId("test-id-userid-value");
    const authenticatedText = screen.getByTestId("test-id-authentication-value");
    const checkResult = screen.getByTestId("test-id-check-result");

    expect(tokenText).toHaveTextContent("Token:");
    expect(userIdText).toHaveTextContent("UserId:");
    expect(authenticatedText).toHaveTextContent("Authenticated: false");
    expect(checkResult).toHaveTextContent("Check Result: not checked");
  });
});

describe("AppContext expired", () => {
  // Create a copy of our original process.env so we can update it test by test
  const originalEnv = process.env;

  beforeEach(() => {
    // Here, we set the expired date to the current date so it's expired
    setMockAuthStorage({ token: "mock-token", userId: "mock-user-id", expiresIn: new Date(Date.now()).toISOString() });
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

  it("Validates expired user", async () => {
    // Render an empty component
    const { baseElement } = render(<AppContextProvider>{<Children />}</AppContextProvider>);

    // Running the default functions since we're not passing parameters through
    const validateButton = screen.getByTestId("test-id-validate-button");
    const checkUserButton = screen.getByTestId("test-id-check-button");
    const logoutUserButton = screen.getByTestId("test-id-logout-button");

    await act(async () => {
      userEvent.click(validateButton);
      userEvent.click(checkUserButton);
      userEvent.click(logoutUserButton);
    });

    // Ensure that the user isn't validated
    const authenticatedText = screen.getByTestId("test-id-authentication-value");
    const token = screen.getByTestId("test-id-token-value");
    const userId = screen.getByTestId("test-id-userid-value");

    expect(authenticatedText).toHaveTextContent("Authenticated: false");
    expect(token).toHaveTextContent("Token:");
    expect(userId).toHaveTextContent("UserId:");

    expect(baseElement).toMatchSnapshot();
  });

  it("Checks for an expired user", async () => {
    render(<AppContextProvider>{<Children />}</AppContextProvider>);

    const checkAuthenticationButton = screen.getByTestId("test-id-check-button");
    await act(async () => {
      userEvent.click(checkAuthenticationButton);
    });

    const checkResult = screen.getByTestId("test-id-check-result");
    expect(checkResult).toHaveTextContent("Check Result: false");
  });

  it("Uses default context methods when no provider is present", () => {
    // Render Children without AppContextProvider wrapper
    render(<Children />);

    // Get the buttons
    const validateButton = screen.getByTestId("test-id-validate-button");
    const checkAuthenticationButton = screen.getByTestId("test-id-check-button");
    const logoutButton = screen.getByTestId("test-id-logout-button");

    // Click all buttons - these will call the default empty methods
    userEvent.click(validateButton);
    userEvent.click(checkAuthenticationButton);
    userEvent.click(logoutButton);

    // Verify the default values are shown
    const tokenText = screen.getByTestId("test-id-token-value");
    const userIdText = screen.getByTestId("test-id-userid-value");
    const authenticatedText = screen.getByTestId("test-id-authentication-value");
    const checkResult = screen.getByTestId("test-id-check-result");

    expect(tokenText).toHaveTextContent("Token:");
    expect(userIdText).toHaveTextContent("UserId:");
    expect(authenticatedText).toHaveTextContent("Authenticated: undefined");
    expect(checkResult).toHaveTextContent("Check Result: false");
  });
});

describe("AppContext localStorage is empty", () => {
  // Create a copy of our original process.env so we can update it test by test
  const originalEnv = process.env;

  beforeEach(() => {
    // Here, we set the expired date to the current date so it's expired
    setMockAuthStorage({ token: undefined, userId: undefined, expiresIn: undefined });
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

  it("Returns false when authentication data is missing from localStorage", () => {
    // Clear all auth storage to simulate missing data
    clearAuthStorage();

    let contextValue: ContextProps | null = null;

    const TestComponent = () => {
      contextValue = useContext(AppContext);
      return null;
    };

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>,
    );

    const result = contextValue!.checkAuthentication();
    expect(result).toBe(false);
  });
});
