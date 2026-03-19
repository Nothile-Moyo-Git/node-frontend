/**
 * Author: Nothile Moyo
 * Date created: 29/09/2025
 *
 * @description: This is the test file for the Post Screen component
 * We authenticate the user, and if valid, we then show the individual post information
 */

import "@testing-library/jest-dom";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { act, screen, waitFor } from "@testing-library/react";
import { renderWithContext } from "../../test-utils/testRouter";
import PostScreen from "./PostScreen";
import { mockContext, mockPost } from "../../test-utils/mocks/objects";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { ContextProps } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

let mockNavigate = jest.fn();

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();

  // Reset our mocked function for each test
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;

  // Update our mockRouterDOM values
  mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  // Mock the useLocation, override our key so it doesn't use default so we can see the back button
  (useLocation as jest.Mock).mockReturnValue({
    key: `/post/${mockPost._id}`,
    pathname: `/post/${mockPost._id}`,
    search: "",
    hash: "",
    state: null,
  });
});

describe("Post Screen Component", () => {
  // Cleanup mocks and environment
  afterEach(() => {
    clearAuthStorage();
    jest.clearAllMocks();
  });

  it("Matches the screenshot", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            success: true,
            post: mockPost,
            message: "Request successful",
          },
        },
      }),
    );

    // Render the post screen
    await act(async () => {
      renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);
    });

    // Build and check the snapshot
    const postScreenComponent = screen.getByTestId("test-id-post-screen");
    expect(postScreenComponent).toBeVisible();
    expect(postScreenComponent).toMatchSnapshot();
  });

  it("Shows the loading spinner", async () => {
    // Mock the server request to never resolve so we see the loading spinner
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);

    // Check to see if the loading spinner is visible
    const loadingIndicator = await screen.findByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Shows post information on the page", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            success: true,
            post: mockPost,
            message: "Request successful",
          },
        },
      }),
    );

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);

    await waitFor(async () => {
      // Find post information
      const postTitle = screen.getByText(mockPost.title);
      expect(postTitle).toBeVisible();

      const postDescription = screen.getByText(mockPost.content);
      expect(postDescription).toBeVisible();
    });
  });

  it("Attemps to fetch a post but fails due to no id", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            success: false,
            message: "Request successful",
            post: null,
          },
        },
      }),
    );

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/` }, mockContext);

    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      expect(errorModal).toBeVisible();
    });
  });

  it("Show the error modal", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            message: "Request successful",
            post: mockPost,
            success: false,
          },
        },
      }),
    );

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);

    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      expect(errorModal).toBeVisible();
    });
  });

  it("Trigger the catch block in the response", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network failed"));

    // We're ignoring the console in this test as we don't need the output here, but is useful for dev / prod
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => console.log("Error"));

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);

    await waitFor(() => expect(errorSpy).toHaveBeenCalledTimes(1));
  });

  it("Redirects to the login page", async () => {
    // Pass an inauthenticated context to the mock
    const inauthenticatedContext: ContextProps = {
      ...mockContext,
      userAuthenticated: false,
    };

    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            success: true,
            post: mockPost,
            message: "Request successful",
          },
        },
      }),
    );

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, inauthenticatedContext);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
  });

  it("Triggers the catch block for image loading", async () => {
    const mockPostWithBadImage = {
      ...mockPost,
      fileName: "non-existent-image.jpg",
      fileLastUpdated: "invalid-folder",
    };

    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            success: true,
            post: mockPostWithBadImage,
            message: "Request successful",
          },
        },
      }),
    );

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    renderWithContext(<PostScreen />, { route: `/post/${mockPostWithBadImage._id}` }, mockContext);

    await waitFor(() => expect(logSpy).toHaveBeenCalledWith("Post screen image error"));

    logSpy.mockRestore();
  });

  it("Presses the go back button", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostResponse: {
            success: true,
            post: mockPost,
            message: "Request successful",
          },
        },
      }),
    );

    // Render the post screen
    await act(async () => {
      renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);
    });

    // Wait for the API request to complete, and then find the error modal on the page
    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    const backButton = screen.getByTestId("test-id-post-back-button");
    expect(backButton).toBeVisible();

    userEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
