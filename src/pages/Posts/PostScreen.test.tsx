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

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();

  // Reset our mocked function for each test
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
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
          message: "Request successful",
          post: mockPost,
          success: true,
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

  it.only("Shows post information on the page", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          message: "Request successful",
          post: mockPost,
          success: true,
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

  it("Show the error modal", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest.fn().mockResolvedValueOnce(
      createFetchResponse({
        data: {
          message: "Request successful",
          post: mockPost,
          success: false,
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
});
