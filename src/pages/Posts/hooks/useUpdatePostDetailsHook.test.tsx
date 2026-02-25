/**
 * Date created: 09/02/2026
 *
 * Author: Nothile Moyo
 *
 * Description: The hook for getting the post details
 */

import { act, ReactNode } from "react";
import { ContextProps } from "../../../context/AppContext";
import { mockContext, mockFileProps, mockPost } from "../../../test-utils/mocks/objects";
import { AppContext } from "../../../context/AppContext";
import { renderHook } from "@testing-library/react";
import useUpdatePostDetails from "./useUpdatePostDetailsHook";
import { createFetchResponse } from "../../../test-utils/methods/methods";

// Create a copy of our original process.env so we can update it test by test
const originalEnv = process.env;

// Mock checkSessionValidation
jest.mock("../../../util/util", () => ({
  ...jest.requireActual("../../../util/util"),
  checkSessionValidation: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Variations of mockContext for testing
const validatedMockContext: ContextProps = {
  ...mockContext,
  validateAuthentication: jest.fn(() => {
    mockContext.token = "fake-token";
    mockContext.userAuthenticated = true;
    mockContext.userId = "12345-nothile-id";
  }),
};

// Mock our content wrapper since we'll pass the child elements inside of it
const wrapper = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={validatedMockContext}>{children}</AppContext.Provider>;
};

describe("useUpdatePostDetails Hook", () => {
  beforeEach(() => {
    jest.resetModules();

    // Create a new copy of process.env so we an update it
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    jest.clearAllMocks();

    // Create a new copy of process.env so we an update it
    process.env = { ...originalEnv };
  });

  it("Handles updating the post", async () => {
    // Mock our request for predictable values
    // We only mock the requests we perform specifically in the hook
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostEditPostResponse: {
            post: mockPost,
            status: 200,
            success: true,
            message: "200 : Request was successful",
            fileValidProps: mockFileProps,
            isContentValid: true,
            isTitleValid: true,
            isPostCreator: true,
          },
        },
      }),
    );

    // Result is what we return from the hook, we render it with our wrapper to test the functionality
    const { result } = renderHook(
      () =>
        useUpdatePostDetails({
          postId: mockPost._id,
        }),
      { wrapper },
    );

    // Trigger the query
    await act(async () => {
      await result.current.handleUpdatePostQuery({
        fileData: mockFileProps,
        userId: validatedMockContext.userId ?? "",
        carouselImage: null,
        title: "Test title",
        content: "Test content",
      });
    });

    // Now check updated values
    expect(result.current.updatePostDetails.success).toBe(true);
    expect(result.current.updatePostDetails.status).toBe(200);
    expect(result.current.updatePostDetails.message).toBe("200 : Request was successful");
    expect(result.current.updatePostDetails.post).toBe(mockPost);
  });

  it("Handles updating the post in development", async () => {
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

    // Mock our request for predictable values
    // We only mock the requests we perform specifically in the hook
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostEditPostResponse: {
            post: mockPost,
            status: 200,
            success: true,
            message: "200 : Request was successful",
            fileValidProps: mockFileProps,
            isContentValid: true,
            isTitleValid: true,
            isPostCreator: true,
          },
        },
      }),
    );

    // Result is what we return from the hook, we render it with our wrapper to test the functionality
    const { result } = renderHook(
      () =>
        useUpdatePostDetails({
          postId: mockPost._id,
        }),
      { wrapper },
    );

    // Trigger the query
    await act(async () => {
      await result.current.handleUpdatePostQuery({
        fileData: mockFileProps,
        userId: validatedMockContext.userId ?? "",
        carouselImage: mockFileProps,
        title: "Test title",
        content: "Test content",
      });
    });

    // Now check updated values
    expect(result.current.updatePostDetails.success).toBe(true);
    expect(result.current.updatePostDetails.status).toBe(200);
    expect(result.current.updatePostDetails.message).toBe("200 : Request was successful");
    expect(result.current.updatePostDetails.post).toBe(mockPost);
  });
});
