/**
 * Date created: 16/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the PageWrapper component
 * Tests basic functionality
 */

// Mock key jest functionality here, this covers fetch, alert, and window.reload
import { act } from "react";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { mockContext, mockUser } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import { generateUploadDate } from "../../util/util";
import PageWrapper from "./PageWrapper";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextProps } from "../../context/AppContext";

// ---- Test Setup Values ----
const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  jest.clearAllMocks();
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

describe("Textarea Component", () => {
  it("Matches the snapshot", async () => {
    // Handle authentication on the page
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: true,
          },
        },
      }),
    );

    // Render our element so we can compare it to the snapshot
    const { baseElement } = await act(() => renderWithoutRouting(<PageWrapper></PageWrapper>, mockContext));

    expect(baseElement).toMatchSnapshot();
  });

  it("Toggles the menu", async () => {
    // Handle authentication on the page
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: true,
          },
        },
      }),
    );

    // Render our element so we can compare it to the snapshot
    await act(() => renderWithoutRouting(<PageWrapper></PageWrapper>, mockContext));

    // Toggle the menu
    const hideMenuButton = screen.getByTestId("test-id-hide-menu-button");
    expect(hideMenuButton).toBeVisible();
    userEvent.click(hideMenuButton);

    const showMenuButton = screen.getByTestId("test-id-show-menu-button");
    expect(showMenuButton).toBeVisible();
    userEvent.click(showMenuButton);
  });

  it("Not authenticated", async () => {
    // Handle authentication on the page
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockExpiryDate,
            sessionExpires: mockCreationDate,
            user: mockUser,
            success: true,
          },
        },
      }),
    );

    // Inauthenticated user context to pass through
    const inauthenticatedContext: ContextProps = {
      ...mockContext,
      userAuthenticated: false,
    };

    // Render our element so we can compare it to the snapshot
    const { baseElement } = await act(() => renderWithoutRouting(<PageWrapper></PageWrapper>, inauthenticatedContext));

    const hideMenuButton = screen.getByTestId("test-id-hide-menu-button");
    expect(hideMenuButton).toBeVisible();
    userEvent.click(hideMenuButton);

    // Matches the snapshot
    expect(baseElement).toMatchSnapshot();
  });

  /* it("", async () => {

  }); */
});
