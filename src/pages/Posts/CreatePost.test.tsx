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
import { act } from "react";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { mockContext, mockFiles, mockPost, mockUser } from "../../test-utils/mocks/objects";
import { CreatePostComponent } from "./CreatePost";
import { renderWithContext } from "../../test-utils/testRouter";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createFetchResponse } from "../../test-utils/methods/methods";
import userEvent from "@testing-library/user-event";
import { generateBase64FromImage } from "../../util/file";
import { useNavigate } from "react-router-dom";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Create a copy of our original process.env so we can update it test by test
const originalEnv = process.env;

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Get the mocked version of useNavigate
let mockNavigate: jest.Mock;

jest.mock("../../util/file", () => ({
  fileUploadHandler: jest.fn(() =>
    Promise.resolve({
      fileName: "test-image.png",
      imageUrl: "/uploads/2024/01/test-image.png",
      isFileValid: true,
      isFileSizeValid: true,
      isFileTypeValid: true,
      isImageUrlValid: true,
    }),
  ),
  generateBase64FromImage: jest.fn(() => Promise.resolve("data:image/png;base64,mockBase64String")),
}));

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  // Mock storage
  setMockAuthStorage();
  // Type cast mock to work as a regular fetch but using jest instead
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  // Mock our API requests between tests
  jest.clearAllMocks();

  // Mock the result, and then mock the behavior that occurs if useNavigate is called
  mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      href: `${process.env.REACT_APP_API_DEV}/post/create`,
    },
    writable: true,
  });

  jest.resetModules();
  // Create a new copy of process.env so we an update it
  process.env = { ...originalEnv };
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
  jest.clearAllMocks();
  // Reset our process variable
  process.env = originalEnv;
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

  it("Should emulate file upload simulating a dev environment", async () => {
    // Mock the environment variables
    // This is so we can test dev and prod environment variables in the context
    // This allows us to update read-only properties
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

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

    const fileInput = screen.getByTestId("test-id-create-post-file-upload-input");

    // Create a mock file that we'll attach to the input
    const file = new File(["dummy content"], "test-image-png", { type: "image/png" });

    // Simulate file selection
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(generateBase64FromImage).toHaveBeenCalledWith(file);
    });
  });

  it("Should fail at emulating a file upload due to file size", async () => {
    // Mock the environment variables
    // This is so we can test dev and prod environment variables in the context
    // This allows us to update read-only properties
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

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

    const fileInput = screen.getByTestId("test-id-create-post-file-upload-input");

    // Create a file larger than 5MB
    const largeFile = new File(["x".repeat(5000001)], "large-image.png", { type: "image/png" });

    // Simulate file selection
    fireEvent.change(fileInput, {
      target: { files: [largeFile] },
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please upload a file smaller than 5MB");
    });

    expect(fileInput).toHaveValue("");
  });

  it("Fails the request to create a post and triggers the catch block", async () => {
    mockFetch
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
      .mockRejectedValueOnce(new Error("Network failed"));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => console.log("Error"));

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

    // Check our base values, then try to submit so we get an error
    expect(titleInput).toHaveTextContent("");
    expect(contentInput).toHaveTextContent("");

    userEvent.type(titleInput, "abcdef");
    userEvent.type(contentInput, "abcdefghijkl");
    userEvent.click(chooseImageButton);

    const saveButton = screen.getByTestId("test-id-create-post-button");
    await act(async () => {
      userEvent.click(saveButton);
    });

    await waitFor(() => expect(errorSpy).toHaveBeenCalledTimes(2));
  });

  it("Simulates file uploads in a development environment with the API", async () => {
    // Mock the environment variables
    // This is so we can test dev and prod environment variables in the context
    // This allows us to update read-only properties
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

    // Mock the api request for the carousel
    mockFetch
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
      )
      .mockResolvedValueOnce(createFetchResponse({}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");
    const fileInput = screen.getByTestId("test-id-create-post-file-upload-input");

    // Create a mock file that we'll attach to the input
    const file = new File(["dummy content"], "test-image-png", { type: "image/png" });

    // Simulate file selection
    await act(async () => {
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
    });

    await waitFor(() => {
      const imagePreview = screen.queryByTestId("test-id-create-post-image-preview");
      expect(imagePreview).toBeInTheDocument();
    });

    // Now fill in the form
    await act(async () => {
      userEvent.type(titleInput, "Valid Test Title");
      userEvent.type(contentInput, "Valid test content that is long enough");
    });

    const saveButton = screen.getByTestId("test-id-create-post-button");
    await act(async () => {
      userEvent.click(saveButton);
    });

    // Give these time to run as they don't by default
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Post successfully submitted"));
    });
  });

  it("Simulates the user not being authenticated and the page redirecting to login", async () => {
    // Set user authenticated to false so we can redirect to the login page
    const mockFailedContext = {
      ...mockContext,
      userAuthenticated: false,
    };

    // Mock the api request for the carousel
    mockFetch
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
      )
      .mockResolvedValueOnce(createFetchResponse({}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockFailedContext);

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");
    const chooseImageButton = screen.getByTestId("test-id-carousel-choose-button");

    // Now fill in the form
    await act(async () => {
      userEvent.type(titleInput, "Valid Test Title");
      userEvent.type(contentInput, "Valid test content that is long enough");
      userEvent.click(chooseImageButton);
    });

    // Check that alert and navigate have been called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("Render an error on the page ", async () => {
    // Mock the environment variables
    // This is so we can test dev and prod environment variables in the context
    // This allows us to update read-only properties
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

    // Mock the api request for the carousel
    mockFetch
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
      )
      .mockResolvedValueOnce(createFetchResponse({}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");

    const imageLabel = screen.getByTestId("test-id-create-post-image-label");
    const saveButton = screen.getByTestId("test-id-create-post-button");

    await act(async () => {
      userEvent.type(titleInput, "Valid Test Title");
      userEvent.type(contentInput, "Valid test content that is long enough");
      userEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(imageLabel).toHaveTextContent("Error: Please upload a PNG, JPEG or JPG (max size: 5Mb)");
    });
  });

  it("Handle updating the inputs for the title and the content on the page", async () => {
    // Mock the api request for the carousel
    mockFetch
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
      )
      .mockResolvedValueOnce(createFetchResponse({}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(<CreatePostComponent />, { route: `/post/create` }, mockContext);

    const titleInput = screen.getByTestId("test-id-create-post-title-input");
    const contentInput = screen.getByTestId("test-id-create-post-content-input");

    // Check inputs
    expect(titleInput).toHaveValue("");
    expect(titleInput).toHaveTextContent("");
    expect(contentInput).toHaveValue("");
    expect(contentInput).toHaveTextContent("");

    await act(async () => {
      userEvent.type(titleInput, "Valid Test Title");
      userEvent.type(contentInput, "Valid test content that is long enough");
    });

    await waitFor(() => {
      expect(titleInput).toHaveValue("Valid Test Title");
      expect(titleInput).toHaveTextContent("Valid Test Title");
      expect(contentInput).toHaveValue("Valid test content that is long enough");
      expect(contentInput).toHaveTextContent("Valid test content that is long enough");
    });
  });
});
