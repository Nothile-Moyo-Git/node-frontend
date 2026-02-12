/**
 * Date created: 09/02/2026
 *
 * Author: Nothile Moyo
 *
 * Description: The hook for getting the post details
 */

import { ReactNode } from "react";
import { ContextProps } from "../../../context/AppContext";
import { mockContext, mockFileProps, mockPost, mockUser } from "../../../test-utils/mocks/objects";
import { AppContext } from "../../../context/AppContext";
import { renderHook, waitFor } from "@testing-library/react";
import useUpdatePostDetails from "./useUpdatePostDetailsHook";
import { createFetchResponse } from "../../../test-utils/methods/methods";

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

describe("useEditPostDetails Hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Handles the loading spinner successfully", async () => {
    // Mock our request for predictable values
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

    const { result } = renderHook(
      () =>
        useUpdatePostDetails({
          postId: mockPost._id,
        }),
      { wrapper },
    );
 
    
  });
});
