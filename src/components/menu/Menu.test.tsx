/**
 * Date created: 18/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the Menu component
 * This tests the functionality of the menu component and it's resposnive functions and visibility
 */
import { act } from "react";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import { screen } from "@testing-library/react";
import Menu from "./Menu";
import userEvent from "@testing-library/user-event";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { ContextProps } from "../../context/AppContext";

let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

describe("Menu Component", () => {
  it("Matches the snapshot", () => {
    const { baseElement } = renderWithoutRouting(<Menu isMenuOpen toggleMenu={jest.fn()} />, mockContext);

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders the snapshot without authentication", () => {
    // Make user inauthenciated so we can see the login / logout buttons from the beginning
    const inauthenticatedContext: ContextProps = {
      ...mockContext,
      userAuthenticated: false,
    };

    const { baseElement } = renderWithoutRouting(<Menu isMenuOpen toggleMenu={jest.fn()} />, inauthenticatedContext);

    expect(baseElement).toMatchSnapshot();
  });

  it("Toggles the button", () => {
    // Mock the functionality that our state update would execute
    const toggleMenuMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback(true);
      }
    });

    renderWithoutRouting(<Menu isMenuOpen={false} toggleMenu={toggleMenuMock} />, mockContext);

    // Toggle the menu
    const showMenuButton = screen.getByTestId("test-id-show-menu-button");
    expect(showMenuButton).toBeVisible();
    userEvent.click(showMenuButton);
  });

  it("Logs out from the menu", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          deleteSessionResponse: {
            success: true,
            message: "Logged out successfully",
          },
        },
      }),
    );

    renderWithoutRouting(<Menu isMenuOpen={false} toggleMenu={jest.fn()} />, mockContext);

    // Logout from the menu
    const logoutButton = screen.getByTestId("test-id-logout-button");

    // Await the click and wrap in act since it triggers async state updates
    await act(async () => {
      userEvent.click(logoutButton);
    });

    // Optionally verify the fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
