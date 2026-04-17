/**
 * Author: Nothile Moyo
 * Date created: 29/08/2025
 *
 * @description: This is the test file for the View Posts component
 * We authenticate the user, and if valid, we then show a list of all posts on the page
 */

import "@testing-library/jest-dom";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";

import { renderWithAct, renderWithContext } from "../../test-utils/testRouter";
import { act, screen, waitFor } from "@testing-library/react";
import { ViewPosts } from "./ViewPosts";
import { mockContext, mockPosts } from "../../test-utils/mocks/objects";
import userEvent from "@testing-library/user-event";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { socketEventHandlers } from "../../test-utils/mockModules";

let mockFetch: jest.MockedFunction<typeof fetch>;

// Create a copy of our original process.env so we can update it test by test
const originalEnv = process.env;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  setMockAuthStorage();

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

describe("View Posts component", () => {
  it("Should match snapshot", async () => {
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostsResponse: {
            success: true,
            numberOfPages: 2,
            posts: mockPosts.slice(0, 3),
            message: "OK",
          },
        },
      }),
    );

    // Render the component with our posts and the images being mocked
    await act(async () => {
      renderWithContext(<ViewPosts />, { route: "/posts" }, mockContext);
    });

    // Check if the view posts component is rendered and we navigate to it successfully
    const appComponent = await screen.findByTestId("test-id-view-posts");
    expect(appComponent).toBeInTheDocument();
    expect(appComponent).toMatchSnapshot();
  });

  it("Should show loading spinner on initial render", async () => {
    // Make the request never resolve so the loading spinner keeps spinning
    mockFetch.mockImplementation(() => new Promise(() => {}));

    renderWithContext(<ViewPosts />, { route: "/posts" }, mockContext);

    const loadingIndicator = await screen.findByTestId("test-id-loading-spinner");
    expect(loadingIndicator).toBeVisible();
  });

  it("Renders the error modal as the API request fails", async () => {
    // We're ignoring the console in this test as we don't need the output here, but is useful for dev / prod
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

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

    renderWithContext(<ViewPosts />, { route: "/posts" }, mockContext);

    // Wait for the API request to complete, and then find the error modal on the page
    await waitFor(() => {
      const errorModal = screen.getByTestId("test-id-error-modal");
      const loadingSpinner = screen.queryByTestId("test-id-loading-spinner");

      expect(errorModal).toBeVisible();
      expect(loadingSpinner).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("Renders the View Posts component successfully", async () => {
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostsResponse: {
            success: true,
            numberOfPages: 2,
            posts: mockPosts.slice(0, 3),
            message: "OK",
          },
        },
        status: 200,
      }),
    );

    await act(async () => {
      renderWithContext(<ViewPosts />, { route: "/posts" }, mockContext);
    });

    // Check if the view posts component is rendered and we navigate to it successfully
    const appComponent = screen.getByTestId("test-id-view-posts");
    expect(appComponent).toBeInTheDocument();

    // Check to see if our posts exist
    // We're checking with different identifiers
    const post2B = screen.getByTestId(`test-id-post-${mockPosts[0]._id}`);
    expect(post2B).toBeVisible();

    const postAlfira = screen.getByText(mockPosts[1].title);
    expect(postAlfira).toBeVisible();

    const emeraldHerald = screen.getByText(mockPosts[2].title);
    expect(emeraldHerald).toBeVisible();
  });

  it("Renders the page with pagination and goes to the next page", async () => {
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(0, 3),
              message: "OK",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(3, 6),
              message: "OK",
            },
          },
        }),
      );

    await renderWithAct(<ViewPosts />, { route: "/posts" }, mockContext);

    // Go to page 2 as we have 6 posts which allows us to use pagination
    const paginationPage2 = await screen.findByTestId("test-id-pagination-page-2");

    await act(async () => {
      userEvent.click(paginationPage2);
    });

    const tieflings = await screen.findByTestId(`test-id-post-${mockPosts[3]._id}`);
    expect(tieflings).toBeVisible();

    const edelGard = await screen.findByText(mockPosts[4].title);
    expect(edelGard).toBeVisible();

    const kratos = await screen.findByText(mockPosts[5].title);
    expect(kratos).toBeVisible();

    const appComponent = await screen.findByTestId("test-id-view-posts");
    expect(appComponent).toBeInTheDocument();
    expect(appComponent).toMatchSnapshot();
  });

  it("Deletes a post on the posts page", async () => {
    // Mock the individual requests 1 by 1
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(0, 3),
              message: "OK",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(3, 6),
              message: "OK",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostDeletePostResponse: {
              highestPageNumber: 2,
              numberOfPosts: 5,
              status: 200,
              success: true,
            },
          },
        }),
      )
      .mockResolvedValueOnce(createFetchResponse({ success: true }))
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(3, 5),
              message: "OK",
            },
          },
        }),
      );

    await renderWithAct(<ViewPosts />, { route: "/posts" }, mockContext);

    // Confirm the first page
    expect(screen.queryByText(mockPosts[2].title)).toBeInTheDocument();
    expect(screen.queryByText(mockPosts[4].title)).not.toBeInTheDocument();

    // Navigate to the second page
    const paginationPage2 = await screen.findByTestId("test-id-pagination-page-2");
    await act(async () => userEvent.click(paginationPage2));

    // Find the delete the last post on the page
    const deleteBtn = await screen.findByTestId(`test-id-delete-${mockPosts[5]._id}`);
    expect(deleteBtn).toBeVisible();
    await act(async () => userEvent.click(deleteBtn));
    const confirm = await screen.findByTestId("test-id-confirmation-modal-confirm-button");
    await act(async () => userEvent.click(confirm));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining(`Post ${mockPosts[5]._id} has successfully been deleted`),
      );
    });

    // Find the remaining post
    expect(screen.queryByText(mockPosts[4].title)).toBeInTheDocument();
    expect(screen.queryByText(mockPosts[5].title)).not.toBeInTheDocument();

    const appComponent = await screen.findByTestId("test-id-view-posts");
    expect(appComponent).toBeInTheDocument();
    expect(appComponent).toMatchSnapshot();
  });

  it("Returns an error with success false", async () => {
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostsResponse: {
            success: false,
            numberOfPages: 2,
            posts: mockPosts.slice(0, 3),
            message: "OK",
          },
        },
      }),
    );

    await renderWithAct(<ViewPosts />, { route: "/posts" }, mockContext);

    await waitFor(() => {
      const toastModal = screen.getByTestId("test-id-error-modal");
      expect(toastModal).toBeVisible();
    });
  });

  it("Redirects to last available page when current page exceeds max pages after deletion", async () => {
    // Set the page so it can be mocked
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        href: "http://localhost/posts/2",
      },
      writable: true,
    });

    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(3, 4),
              message: "OK",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostDeletePostResponse: {
              highestPageNumber: 1,
              numberOfPosts: 3,
              status: 200,
              success: true,
            },
          },
        }),
      )
      .mockResolvedValueOnce(createFetchResponse({ success: true }))
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 1,
              posts: mockPosts.slice(0, 3),
              message: "OK",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 1,
              posts: mockPosts.slice(0, 3),
              message: "OK",
            },
          },
        }),
      );

    await renderWithAct(<ViewPosts />, { route: "/posts/2" }, mockContext);

    // Delete the post naturally via the UI
    const deleteBtn = await screen.findByTestId(`test-id-delete-${mockPosts[3]._id}`);
    await act(async () => userEvent.click(deleteBtn));

    const confirm = await screen.findByTestId("test-id-confirmation-modal-confirm-button");
    await act(async () => userEvent.click(confirm));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining(`Post ${mockPosts[3]._id} has successfully been deleted`),
      );
    });

    // Now fire the socket event to trigger refreshPosts which contains the redirect logic
    await act(async () => {
      socketEventHandlers["post deleted"]({ highestPageNumber: 1 });
    });

    await waitFor(() => {
      expect(window.location.href).toContain("/posts/1");
    });
  });

  it("Triggers the catch block when trying to emit post deletion", async () => {
    // Set the page so it can be mocked
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        href: "http://localhost/posts/2",
      },
      writable: true,
    });

    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(3, 4),
              message: "OK",
            },
          },
        }),
      )
      .mockRejectedValueOnce(new Error("Network failed"));

    await renderWithAct(<ViewPosts />, { route: "/posts/2" }, mockContext);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => console.log("Error"));

    // Delete the post naturally via the UI
    const deleteBtn = await screen.findByTestId(`test-id-delete-${mockPosts[3]._id}`);
    await act(async () => userEvent.click(deleteBtn));

    const confirm = await screen.findByTestId("test-id-confirmation-modal-confirm-button");
    await act(async () => userEvent.click(confirm));

    await waitFor(() => expect(errorSpy).toHaveBeenCalledTimes(1));
  });

  it("Triggers the post added toast", async () => {
    jest.useFakeTimers();

    // Mock the environment to be development
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(0, 3),
              message: "OK",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(0, 3),
              message: "OK",
            },
          },
        }),
      );

    await renderWithAct(<ViewPosts />, { route: "/posts" }, mockContext);

    // Fire the "post added" socket event with a mock post payload
    await act(async () => {
      socketEventHandlers["post added"]({
        post: {
          _id: mockPosts[0]._id,
          title: mockPosts[0].title,
        },
      });
    });

    // The toast modal should now be visible with the post title
    await waitFor(() => {
      const toast = screen.getByText(`Success : Post ${mockPosts[0].title} added!`);
      expect(toast).toBeVisible();
    });

    // Ensure that it disappears after 5 seconds
    await act(async () => {
      jest.advanceTimersByTime(5001);
    });

    expect(screen.queryByText(`Success : Post ${mockPosts[0].title} added!`)).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
