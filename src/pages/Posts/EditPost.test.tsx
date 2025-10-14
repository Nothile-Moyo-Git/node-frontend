/**
 * Author: Nothile Moyo
 * Date created: 25/09/2025
 *
 * @description: This is the test file for the Edit Post component
 * We authenticate the user, and if valid, we then show a list of all posts on the page
 */

import "@testing-library/jest-dom";
import { server } from "../../test-utils/mockServer";
import {
  clearAuthStorage,
  setMockAuthStorage,
} from "../../test-utils/authStorage";
import { createFetchResponse } from "../../test-utils/methods/methods";
import {
  mockContext,
  mockPost,
  mockUser,
  mockFiles,
} from "../../test-utils/mocks/objects";
import { renderWithContext } from "../../test-utils/testRouter";
import { EditPost } from "./EditPost";
import { screen, waitFor } from "@testing-library/react";

// Create our mockFetch so we can handle multiple requests
let mockFetch: jest.MockedFunction<typeof fetch>;
const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

// Setup mocks and environment
beforeAll(() => {
  server.listen();
});

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

// End server polling when tests finish
afterAll(() => {
  server.close();
  alertSpy.mockRestore();
});

describe("Edit Post Component", () => {
  it("Shows the loading spinner as the API request is executed", async () => {
    // Make the request never resolve so the loading spinner keeps spinning
    mockFetch.mockImplementation(() => new Promise(() => {}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(
      <EditPost />,
      { route: `/edit-post/${mockPost._id}` },
      mockContext,
    );

    const loadingIndicator = await screen.findByTestId(
      "test-id-loading-spinner",
    );
    expect(loadingIndicator).toBeVisible();
  });

  it("Renders the error modal as the API request fails", async () => {
    // We're ignoring the console in this test as we don't need the output here, but is useful for dev / prod
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockFetch.mockRejectedValueOnce(
      createFetchResponse({
        data: {
          GetPostsResponse: {
            success: false,
            numberOfPages: 2,
            posts: [],
            message: "Error 500 : Request failed, please view the server logs",
          },
        },
        status: 500,
        ok: false,
      }),
    );

    // Render our component with routing and the context so we have authentication
    renderWithContext(
      <EditPost />,
      { route: `/edit-post/${mockPost._id}` },
      mockContext,
    );

    // Wait for the API request to complete, and then find the error modal on the page
    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");

      expect(errorModal).toBeVisible();
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("Matches the screenshot", async () => {
    // Handle the api requests, we sent these requests since we're only mocking single implementations of requests
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetAndValidatePostResponse: {
              success: true,
              message: "200: Request successful",
              post: mockPost,
              isUserValidated: true,
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetFilePathsResponse: {
              status: 200,
              files: mockFiles,
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostEditPostResponse: {
              post: mockPost,
              user: mockUser,
              status: true,
              message: "200: Request successful",
              fileValidProps: {
                fileName: mockPost.fileName,
                imageUrl: mockPost.imageUrl,
                isImageUrlValid: true,
                isFileSizeValid: true,
                isFileTypeValid: true,
                isFileValid: true,
              },
              isContentValid: true,
              isTitleValid: true,
              isPostCreator: true,
            },
          },
        }),
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(
      <EditPost />,
      { route: `/edit-post/${mockPost._id}` },
      mockContext,
    );

    // Make sure we have our edit post
    const editPostComponent = await screen.findByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();
    expect(editPostComponent).toMatchSnapshot();
  });
});
