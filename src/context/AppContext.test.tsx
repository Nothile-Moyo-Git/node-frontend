/**
 * Date created: 22/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the appContext
 */

import { act, useContext } from "react";
import AppContextProvider, { AppContext, ContextProps } from "./AppContext";
import { render } from "@testing-library/react";
import { mockContext } from "../test-utils/mocks/objects";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clearAuthStorage, setMockAuthStorage } from "../test-utils/authStorage";

beforeEach(() => {
  setMockAuthStorage();
});

afterEach(() => {
  clearAuthStorage();
  jest.clearAllMocks();
});

describe("AppContext", () => {
  /* const checkAuthenticationMock = jest.fn(() => true);
  const failedCheckAuthenticationMock = jest.fn(() => false);
  const validateAuthenticationMock = jest.fn(() => {});
  const logoutUserMock = jest.fn(() => {}); */

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

  /* it("Calls validateAuthentication with an environment of dev", () => {
    // Render an empty component
    const { baseElement } = render(<AppContextProvider>{<Children />}</AppContextProvider>);

    // Check to make sure we see the buttons
    const validateButton = screen.getByTestId("test-id-validate-button");

    userEvent.click(checkAuthenticationButton);

    // Check if it matches the snapshot
    expect(baseElement).toMatchSnapshot();
  }); */
});
