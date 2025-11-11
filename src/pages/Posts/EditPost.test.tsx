/**
 * Author: Nothile Moyo
 * Date created: 25/09/2025
 *
 * @description: This is the test file for the Edit Post component
 * We authenticate the user, and if valid, we then show a list of all posts on the page
 */

import "@testing-library/jest-dom";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { mockContext, mockPost, mockFiles, updatedMockPost } from "../../test-utils/mocks/objects";
import { renderWithContext } from "../../test-utils/testRouter";
import { EditPost } from "./EditPost";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
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

describe("Edit Post Component", () => {
  it("Shows the loading spinner as the API request is executed", async () => {
    // Make the request never resolve so the loading spinner keeps spinning
    mockFetch.mockImplementation(() => new Promise(() => {}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(<EditPost />, { route: `/post/edit/${mockPost._id}` }, mockContext);

    const loadingIndicator = await screen.findByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Renders the error modal as the API request fails", async () => {
    // We're ignoring the console in this test as we don't need the output here, but is useful for dev / prod
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetAndValidatePostResponse: {
              success: false,
              message: "500: Request unsuccessful",
              post: null,
              isUserValidated: false,
              status: 500,
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetFilePathsResponse: {
              status: 500,
              files: [],
            },
          },
        }),
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<EditPost />, { route: `/post/edit/${mockPost._id}` }, mockContext);

    // Wait for the API request to complete, and then find the error modal on the page
    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");

      expect(errorModal).toBeVisible();
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("Matches the snapshot", async () => {
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
              status: 200,
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
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<EditPost />, { route: `/post/edit/${mockPost._id}` }, mockContext);

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    // Make sure we have our edit post
    const editPostComponent = await screen.findByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();
    expect(editPostComponent).toMatchSnapshot();
  });

  it("Completely loads the page", async () => {
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
              status: 200,
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
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<EditPost />, { route: `/post/edit/${mockPost._id}` }, mockContext);

    const editPostComponent = screen.getByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();

    // Make sure we have our edit post
    await waitFor(() => {
      const carousel = screen.getByTestId("test-id-carousel-button");
      expect(carousel).toBeVisible();
    });

    expect(editPostComponent).toMatchSnapshot();
  });

  it("Validate the inputs and handle errors", async () => {
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
              status: 200,
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
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<EditPost />, { route: `/post/edit/${mockPost._id}` }, mockContext);

    const editPostComponent = screen.getByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();

    // Make sure we have our edit post
    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();

      const carousel = screen.getByTestId("test-id-carousel-button");
      expect(carousel).toBeVisible();
    });

    // Find the Title input and validate errors
    const titleLabel = screen.getByTestId("test-id-edit-post-title-label");
    const titleInput = screen.getByTestId("test-id-edit-post-title-input");
    expect(titleInput).toHaveValue(mockPost.title);

    const saveButton = screen.getByTestId("test-id-edit-post-submit-button");
    expect(saveButton).toBeVisible();

    // Find the content input and validate errors
    const contentLabel = screen.getByTestId("test-id-edit-post-content-label");
    const contentInput = screen.getByTestId("test-id-edit-post-content-input");
    expect(contentInput).toHaveValue(mockPost.content);

    userEvent.clear(contentInput);
    userEvent.type(contentInput, "abc");

    userEvent.click(saveButton);

    expect(titleLabel).toHaveTextContent("Error: Title must be longer than 3 characters and less than 100");

    expect(contentLabel).toHaveTextContent(
      "Error: Content must be longer than 6 characters and less than 600 characters",
    );
  });

  it("Update content on the editPost page", async () => {
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
              status: 200,
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
              post: updatedMockPost,
              status: 200,
              success: true,
              message: "200 : Request was successful",
              fileValidProps: {
                fileName: mockFiles[0].fileName,
                imageUrl: mockFiles[0].imageUrl,
                isFileValid: true,
                isFileTypeValid: true,
                isImageUrlValid: true,
                isFileSizeValid: true,
              },
              isContentValid: true,
              isTitleValid: true,
              isPostCreator: true,
            },
          },
        }),
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<EditPost />, { route: `/post/edit/${mockPost._id}` }, mockContext);

    const editPostComponent = screen.getByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();

    // Make sure we have our edit post
    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();

      const carousel = screen.getByTestId("test-id-carousel-button");
      expect(carousel).toBeVisible();
    });

    const titleInput = screen.getByTestId("test-id-edit-post-title-input");
    const contentInput = screen.getByTestId("test-id-edit-post-content-input");

    expect(titleInput).toHaveValue(mockPost.title);
    expect(contentInput).toHaveValue(mockPost.content);

    const saveButton = screen.getByTestId("test-id-edit-post-submit-button");

    // Update the inputs so we can save them and then mock the request
    userEvent.clear(titleInput);
    userEvent.clear(contentInput);
    userEvent.type(titleInput, updatedMockPost.title);
    userEvent.type(contentInput, updatedMockPost.content);

    expect(titleInput).toHaveValue(updatedMockPost.title);
    expect(contentInput).toHaveValue(updatedMockPost.content);

    userEvent.click(saveButton);

    // Give these time to run as they don't by default
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Success, Post"));
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
