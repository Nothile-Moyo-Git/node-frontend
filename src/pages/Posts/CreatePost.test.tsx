/**
 *
 * Author: Nothile Moyo
 * Date created: 09/11/2025
 *
 * Description: Test for the create post component
 * This will check for the loading spinner, failure on load, and creating / validating post creation
 * Since this is a test environment, it should use carousel as that's for production
 */

import "@testing-library/jest-dom";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { mockContext, mockFiles, mockPost, mockUser } from "../../test-utils/mocks/objects";
import { CreatePostComponent } from "./CreatePost";
import { renderWithContext } from "../../test-utils/testRouter";
import { screen, waitFor } from "@testing-library/react";
import { createFetchResponse } from "../../test-utils/methods/methods";
import userEvent from "@testing-library/user-event";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  jest.clearAllMocks();

  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      href: `${process.env.REACT_APP_API_DEV}/post/create`,
    },
    writable: true,
  });
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

describe("Create Post Component", () => {
  it("Should show the loading spinner for the carousel", async () => {
    // Make the request never resolve so the loading spinner keeps spinning
    mockFetch.mockImplementation(() => new Promise(() => {}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    const loadingIndicator = await screen.findByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Matches the snapshot", async () => {
    // Mock the api request for the carousel
    global.fetch = jest.fn().mockResolvedValueOnce(
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
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    const chooseImageButton = screen.getByTestId("test-id-carousel-choose-button");
    expect(chooseImageButton).toBeVisible();

    // Make sure we have our edit post
    const editPostComponent = await screen.findByTestId("test-id-create-post");
    expect(editPostComponent).toBeVisible();
    expect(editPostComponent).toMatchSnapshot();
  });

  it("Validate the inputs and handle errors", async () => {
    // Mock the api request for the carousel
    global.fetch = jest.fn().mockResolvedValueOnce(
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
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    const chooseImageButton = screen.getByTestId("test-id-carousel-choose-button");
    expect(chooseImageButton).toBeVisible();

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");

    const titleLabel = screen.getByTestId("test-id-create-post-title-label");
    const contentLabel = screen.getByTestId("test-id-create-post-content-label");

    // Check our base values, then try to submit so we get an error
    expect(titleInput).toHaveTextContent("");
    expect(contentInput).toHaveTextContent("");

    userEvent.type(titleInput, "a");
    userEvent.type(contentInput, "abc");

    const saveButton = screen.getByTestId("test-id-create-post-button");
    userEvent.click(saveButton);

    expect(titleLabel).toHaveTextContent("Error: Title must be longer than 3 characters and less than 100");

    expect(contentLabel).toHaveTextContent(
      "Error: Content must be longer than 6 characters and less than 600 characters",
    );
  });

  it("Should successfully perform the API request to create a post", async () => {
    // Mock the api request for the carousel
    global.fetch = jest
      .fn()
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
            PostCreatePostResponse: {
              post: mockPost,
              user: mockUser,
              status: 201,
              success: true,
              message: "Post created successfully",
              isContentValid: true,
              isTitleValid: true,
              isFileValid: true,
              isFileTypeValid: true,
              isFileSizeValid: true,
            },
          },
        }),
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");

    const chooseImageButton = screen.getByTestId("test-id-carousel-choose-button");
    expect(chooseImageButton).toBeVisible();

    const submitButton = screen.getByTestId("test-id-create-post-button");

    userEvent.click(chooseImageButton);
    userEvent.type(titleInput, "ABC");
    userEvent.type(contentInput, "ABCEDF");
    userEvent.click(submitButton);

    // Give these time to run as they don't by default
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Post successfully submitted"));
      expect(window.location.href).toContain("/posts");
    });
  });

  it("Should render errors if creation fails from the backend", async () => {
    // Mock the api request for the carousel
    global.fetch = jest
      .fn()
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
            PostCreatePostResponse: {
              post: null,
              user: mockUser,
              status: 421,
              success: false,
              message: "Post creation unsuccessful",
              isContentValid: false,
              isTitleValid: false,
              isFileValid: false,
              isFileTypeValid: true,
              isFileSizeValid: true,
            },
          },
        }),
      );

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");

    const titleLabel = screen.getByTestId("test-id-create-post-title-label");
    const contentLabel = screen.getByTestId("test-id-create-post-content-label");

    const chooseImageButton = screen.getByTestId("test-id-carousel-choose-button");
    expect(chooseImageButton).toBeVisible();

    const submitButton = screen.getByTestId("test-id-create-post-button");

    userEvent.click(chooseImageButton);
    userEvent.type(titleInput, "ABC");
    userEvent.type(contentInput, "ABCEDF");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(titleLabel).toHaveTextContent("Error: Title must be longer than 3 characters and less than 100");
      expect(contentLabel).toHaveTextContent(
        "Error: Content must be longer than 6 characters and less than 600 characters",
      );
    });
  });
});
