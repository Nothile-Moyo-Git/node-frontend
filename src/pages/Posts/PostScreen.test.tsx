/**
 * Author: Nothile Moyo
 * Date created: 29/09/2025
 *
 * @description: This is the test file for the Post Screen component
 * We authenticate the user, and if valid, we then show the individual post information
 */

import "@testing-library/jest-dom";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { act, screen } from "@testing-library/react";
import { renderWithContext } from "../../test-utils/testRouter";
import PostScreen from "./PostScreen";
import { mockContext, mockPost } from "../../test-utils/mocks/objects";

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

describe("Post Screen Component", () => {
  it("Matches the screenshot", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          data: {
            GetPostResponse: {
              message: "Request successful",
              post: mockPost,
              success: true,
            },
          },
        }),
    });

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
    // Mock the request so we can get post data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          data: {
            GetPostResponse: {
              message: "Request successful",
              post: mockPost,
              success: true,
            },
          },
        }),
    });

    // Render the post screen
    renderWithContext(<PostScreen />, { route: `/post/${mockPost._id}` }, mockContext);

    // Find post information
    const postTitle = await screen.findByText(mockPost.title);
    expect(postTitle).toBeVisible();

    const postDescription = await screen.findByText(mockPost.content);
    expect(postDescription).toBeVisible();
  });
});
