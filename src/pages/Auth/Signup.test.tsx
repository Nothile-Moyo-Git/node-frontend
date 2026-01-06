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
    // Mock the result, and then mock the behavior that occurs if useNavigate is called
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

  it("Responds with an error because a user already exists", async () => {
    // Mock the api response of a successful signup
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          signupUserResponse: {
            isNameValid: true,
            isEmailValid: true,
            isPasswordValid: true,
            doPasswordsMatch: true,
            userExists: true,
            userCreated: false,
          },
        },
      }),
    );

    // Generate the snapshot from rendering the component
    renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

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

    const emailLabel = screen.getByTestId("test-id-signup-email-label");
    await waitFor(() => {
      expect(emailLabel).toHaveTextContent("Error: User already exists with this email");
    });
  });

  it("Responds with an error because the name is invalid", async () => {
    // Mock the api response of a successful signup
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          signupUserResponse: {
            isNameValid: false,
            isEmailValid: true,
            isPasswordValid: true,
            doPasswordsMatch: true,
            userExists: false,
            userCreated: false,
          },
        },
      }),
    );

    // Generate the snapshot from rendering the component
    renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

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

    const nameLabel = screen.getByTestId("test-id-signup-name-label");
    await waitFor(() => {
      expect(nameLabel).toHaveTextContent("Error: Name must be at least 6 characters");
    });
  });

  it("Responds with an error because the email is invalid", async () => {
    // Mock the api response of a successful signup
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          signupUserResponse: {
            isNameValid: true,
            isEmailValid: false,
            isPasswordValid: true,
            doPasswordsMatch: true,
            userExists: false,
            userCreated: false,
          },
        },
      }),
    );

    // Generate the snapshot from rendering the component
    renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

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

    const emailLabel = screen.getByTestId("test-id-signup-email-label");
    await waitFor(() => {
      expect(emailLabel).toHaveTextContent("Error: Email address isn't valid");
    });
  });

  it("Triggers the catch block by throwing an error", async () => {
    // Mock the request returning an error
    mockFetch.mockRejectedValueOnce(new Error("Network failed"));

    // Generate the snapshot from rendering the component
    renderWithContext(<SignupPage />, { route: "/signup" }, mockContext);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => console.log("Error"));

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

    await waitFor(() => expect(errorSpy).toHaveBeenCalledTimes(1));
  });
});
