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
import {
  clearAuthStorage,
  setMockAuthStorage,
} from "../../test-utils/authStorage";
import { mockContext, mockFiles } from "../../test-utils/mocks/objects";
import { CreatePostComponent } from "./CreatePost";
import { renderWithContext } from "../../test-utils/testRouter";
import { screen, waitFor } from "@testing-library/react";
import { createFetchResponse } from "../../test-utils/methods/methods";

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

describe("Create Post Component", () => {
  it("Should show the loading spinner for the carousel", async () => {
    // Make the request never resolve so the loading spinner keeps spinning
    mockFetch.mockImplementation(() => new Promise(() => {}));

    // Render our component with routing and the context so we have authentication
    renderWithContext(
      <CreatePostComponent />,
      { route: `/post/create` },
      mockContext,
    );

    const loadingIndicator = await screen.findByTestId(
      "test-id-loading-spinner",
    );
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
    renderWithContext(
      <CreatePostComponent />,
      { route: `/post/create` },
      mockContext,
    );

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();

      const carousel = screen.getByTestId("test-id-carousel-button");
      expect(carousel).toBeVisible();
    });

    // Make sure we have our edit post
    const editPostComponent = await screen.findByTestId("test-id-create-post");
    expect(editPostComponent).toBeVisible();
    expect(editPostComponent).toMatchSnapshot();
  });
});
