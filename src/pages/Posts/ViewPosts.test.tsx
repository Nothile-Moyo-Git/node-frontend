/**
 * Author: Nothile Moyo
 * Date created: 29/08/2025
 *
 * @description: This is the test file for the View Posts component
 * We authenticate the user, and if valid, we then show a list of all posts on the page
 */

import "@testing-library/jest-dom";
import {
  clearAuthStorage,
  setMockAuthStorage,
} from "../../test-utils/authStorage";
import { server } from "../../test-utils/mockServer";
import { renderWithAct, renderWithContext } from "../../test-utils/testRouter";
import { act, screen } from "@testing-library/react";
import { ViewPosts } from "./ViewPosts";
import { mockContext, mockPosts } from "../../test-utils/objects/objects";
import userEvent from "@testing-library/user-event";

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
  jest.clearAllMocks();
  jest.resetAllMocks();
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  setMockAuthStorage();
});

// Cleanup mocks and environment
afterEach(() => {
  server.resetHandlers();
  clearAuthStorage();
});

afterAll(() => {
  server.close();
  alertSpy.mockRestore();
});

// Mock our fetch functioality
const createFetchResponse = (data: unknown, status = 200): Response => {
  return {
    ok: true,
    status,
    json: async () => data,
  } as Response;
};

describe("View Posts component", () => {
  it("Should match snapshot", async () => {
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostsResponse: {
            success: true,
            numberOfPages: 2,
            posts: mockPosts,
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

    const loadingIndicator = await screen.findByTestId(
      "test-id-loading-spinner",
    );
    expect(loadingIndicator).toBeVisible();
  });

  it("Renders the View Posts component successfully", async () => {
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetPostsResponse: {
            success: true,
            numberOfPages: 2,
            posts: mockPosts,
            message: "OK",
          },
        },
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
              posts: mockPosts,
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
              posts: mockPosts,
              message: "OK",
            },
          },
        }),
      );

    await renderWithAct(<ViewPosts />, { route: "/posts" }, mockContext);

    // Go to page 2 as we have 6 posts which allows us to use pagination
    const paginationPage2 = await screen.findByTestId(
      "test-id-pagination-page-2",
    );

    await act(async () => {
      userEvent.click(paginationPage2);
    });

    const post2B = await screen.findByTestId(
      `test-id-post-${mockPosts[3]._id}`,
    );
    expect(post2B).toBeVisible();

    const postAlfira = await screen.findByText(mockPosts[4].title);
    expect(postAlfira).toBeVisible();

    const emeraldHerald = await screen.findByText(mockPosts[5].title);
    expect(emeraldHerald).toBeVisible();
  });

  it("Deletes a post on the posts page", async () => {
    // First, we request page 1, then page 2, then we delete, emit and we fetch our new posts after that
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts,
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
              posts: mockPosts,
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
      .mockResolvedValueOnce(createFetchResponse({}, 200))
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetPostsResponse: {
              success: true,
              numberOfPages: 2,
              posts: mockPosts.slice(0, 5),
              message: "OK",
            },
          },
        }),
      );

    await renderWithAct(<ViewPosts />, { route: "/posts" }, mockContext);

    const paginationPage2 = await screen.findByTestId(
      "test-id-pagination-page-2",
    );
    await act(async () => userEvent.click(paginationPage2));

    const deleteBtn = await screen.findByTestId(
      `test-id-delete-${mockPosts[5]._id}`,
    );
    await act(async () => userEvent.click(deleteBtn));

    const confirm = await screen.findByTestId(
      "test-id-confirmation-modal-confirm-button",
    );
    await act(async () => userEvent.click(confirm));

    // finally assert the post is gone
    expect(screen.queryByText(mockPosts[4].title)).toBeInTheDocument();
    expect(screen.queryByText(mockPosts[5].title)).not.toBeInTheDocument();
  });
});
