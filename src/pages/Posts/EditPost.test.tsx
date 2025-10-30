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
  mockFiles,
} from "../../test-utils/mocks/objects";
import { renderWithContext } from "../../test-utils/testRouter";
import { EditPost } from "./EditPost";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Create our mockFetch so we can handle multiple requests
let mockFetch: jest.MockedFunction<typeof fetch>;
const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

// Mocking socket.io jest so we don't make a real connection
jest.mock("socket.io-client", () => {
  return {
    io: () => ({
      on: jest.fn(),
      emit: jest.fn(),
      removeAllListeners: jest.fn(),
    }),
  };
});

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
    renderWithContext(
      <EditPost />,
      { route: `/edit-post/${mockPost._id}` },
      mockContext,
    );

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
    renderWithContext(
      <EditPost />,
      { route: `/edit-post/${mockPost._id}` },
      mockContext,
    );

    const editPostComponent = screen.getByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();

    // Make sure we have our edit post
    await waitFor(() => {
      const carousel = screen.getByTestId("test-id-carousel-button");
      expect(carousel).toBeVisible();
    });

    expect(editPostComponent).toMatchSnapshot();
  });

  it("Update the content of the page", async () => {
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
    renderWithContext(
      <EditPost />,
      { route: `/edit-post/${mockPost._id}` },
      mockContext,
    );

    const editPostComponent = screen.getByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();

    // Make sure we have our edit post
    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();

      const carousel = screen.getByTestId("test-id-carousel-button");
      expect(carousel).toBeVisible();
    });

    // Find the Title input
    const titleInput = screen.getByTestId("test-id-edit-post-title-input");
    expect(titleInput).toHaveValue(mockPost.title);

    userEvent.clear(titleInput);
    expect(titleInput).toHaveValue("");

    const saveButton = screen.getByTestId("test-id-edit-post-submit-button");
    expect(saveButton).toBeVisible();
  });
});
