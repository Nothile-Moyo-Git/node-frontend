/**
 * Date created: 04/01/2026
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the signup page, mocks the requests and signup functionality
 * It also handles the validation for the input fields
 *
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { setMockAuthStorage, clearAuthStorage } from "../../test-utils/authStorage";
import { useNavigate } from "react-router-dom";
import { waitFor, screen } from "@testing-library/react";
import { renderWithContext } from "../../test-utils/testRouter";
import { SignupPage } from "./Signup";
import { createFetchResponse } from "../../test-utils/methods/methods";
import userEvent from "@testing-library/user-event";
import { act } from "react";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Get the mocked version of useNavigate
let mockNavigate: jest.Mock;

describe("Signup", () => {
  beforeEach(() => {
    setMockAuthStorage();
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
    // Generate the snapshot from rendering the component
    const { baseElement } = renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

    // Check vs the snapshot
    expect(baseElement).toMatchSnapshot();
  });

  it("Redirects to the previous page if the user is logged in", async () => {
    // Generate the snapshot from rendering the component
    renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

    // Validate authentication will automatically run, so we'll need make sure it was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it("Successfully signs the user up and redirects to the login page", async () => {
    // Generate the snapshot from rendering the component
    renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

    // Mock the api response of a successful signup
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          signupUserResponse: {
            isNameValid: true,
            isEmailValid: true,
            isPasswordValid: true,
            doPasswordsMatch: true,
            userExists: false,
            userCreated: true,
          },
        },
      }),
    );

    // Enter the user details
    const nameInput = screen.getByTestId("test-id-signup-name-input");
    const emailInput = screen.getByTestId("test-id-signup-email-input");
    const passwordInput = screen.getByTestId("test-id-signup-password-input");
    const confirmPasswordInput = screen.getByTestId("test-id-signup-password-confirm-input");

    userEvent.type(nameInput, "Name");
    userEvent.type(emailInput, "Email");
    userEvent.type(passwordInput, "Password");
    userEvent.type(confirmPasswordInput, "Password");

    // Perform the request
    const submitButton = screen.getByTestId("test-id-signup-button");
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Check that alert and navigate have been called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Success");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
