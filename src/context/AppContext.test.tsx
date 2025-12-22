/**
 * Date created: 22/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the appContext
 */

import { useContext } from "react";
import { AppContext, ContextProps } from "./AppContext";
import { render } from "@testing-library/react";
import { mockContext } from "../test-utils/mocks/objects";
import { screen } from "@testing-library/react";

describe("AppContext", () => {
  // Instantiate our context and create a child to pass it through, that way, we can test everything
  const Children = () => {
    const appContextInstance: ContextProps = useContext(AppContext);

    return (
      <section>
        <div>
          <p>Token: {appContextInstance.token}</p>
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
    const checkAuthenticationButton = screen.getByTestId("test-id-validate-button");
    const logoutButton = screen.getByTestId("test-id-validate-button");
    expect(validateButton).toBeVisible();
    expect(checkAuthenticationButton).toBeVisible();
    expect(logoutButton).toBeVisible();

    // Check if it matches the snapshot
    expect(baseElement).toMatchSnapshot();
  });
});
