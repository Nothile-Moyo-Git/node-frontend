/**
 * Date created: 09/02/2026
 *
 * Author: Nothile Moyo
 *
 * Description: The hook for getting the post details
 */

import { ReactNode } from "react";
import { ContextProps } from "../../../context/AppContext";
import { mockContext, mockPost, mockUser } from "../../../test-utils/mocks/objects";
import { AppContext } from "../../../context/AppContext";
import { renderHook } from "@testing-library/react";
import useEditPostDetails from "./useEditPostDetailsHook";
import { createFetchResponse } from "../../../test-utils/methods/methods";
import { generateUploadDate } from "../../../util/util";

const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

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
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: true,
          },
        },
      }),
    );
    const { result } = renderHook(
      () =>
        useEditPostDetails({
          userId: mockUser._id,
          postId: mockPost._id,
        }),
      { wrapper },
    );
  });
});
