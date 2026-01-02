/**
 * Date created: 29/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the login page, mocks the requests and login functionality
 *
 */

import { act } from "react";
import { ContextProps } from "../../context/AppContext";
import { setMockAuthStorage, clearAuthStorage } from "../../test-utils/authStorage";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithContext } from "../../test-utils/testRouter";
import { LoginPage } from "./Login";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Get the mocked version of useNavigate
let mockNavigate: jest.Mock;

describe("Login with empty local storage", () => {
  beforeEach(() => {
    setMockAuthStorage({});
    // Reset our modules so we can set new environment variables
    jest.resetModules();
    // Create a new copy of process.env so we an update it
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    clearAuthStorage();
    jest.clearAllMocks();
  });

  it("Matches the snapshot", () => {
    // Make sure our user isn't authenticated so we don't get redirected away from the login page
    const emptyContext: ContextProps = {
      ...mockContext,
      userAuthenticated: false,
    };

    // Make sure the user isn't logged in otherwise it will redirect
    const { baseElement } = renderWithContext(<LoginPage />, { route: "/login" }, emptyContext);

    expect(baseElement).toMatchSnapshot();
  });

  it("Successfully navigates the user if they log in successfully", async () => {
    // Make sure our user isn't authenticated so we don't get redirected away from the login page
    const emptyContext: ContextProps = {
      ...mockContext,
      userAuthenticated: false,
    };

    // Get the navigate object from the response so we can make sure our redirect to the home page works
    const { baseElement } = await act(async () => {
      return renderWithContext(<LoginPage />, { route: "/login" }, emptyContext);
    });

    // Mock the api response
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          loginResponse: {
            userExists: true,
            success: true,
            emailValid: true,
            passwordValid: true,
            emailErrorText: "",
            passwordErrorText: "",
            token: mockContext.token,
            userId: mockContext.userId,
          },
        },
      }),
    );

    // Get the email address and password
    const emailInput = screen.getByTestId("test-id-login-email-input");
    const passwordInput = screen.getByTestId("test-id-login-password-input");
    const submitButton = screen.getByTestId("test-id-login-button");

    // Input values and submit the form
    userEvent.type(emailInput, "test-email@gmail.com");
    userEvent.type(passwordInput, "test-id-login-password-input");
    userEvent.click(submitButton);

    // Do an awaitFor here as you need an act for state updates, but is for a method call
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));

    expect(baseElement).toMatchSnapshot();
  });
});
