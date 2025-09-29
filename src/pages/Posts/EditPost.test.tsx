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
  mockUser,
} from "../../test-utils/mocks/objects";
import { renderWithContext } from "../../test-utils/testRouter";
import { EditPost } from "./EditPost";
import { screen } from "@testing-library/react";

// Setup mocks and environment
beforeAll(() => {
  server.listen();
});

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

// End server polling when tests finish
afterAll(() => {
  server.close();
});

describe("Edit Post Component", () => {
  // Handle the api requests
  it("Matches the screenshot", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            GetAndValidatePostResponse: {
              success: false,
              message: "200: Request successful",
              post: mockPost,
              isUserValidated: true,
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostEditPostResponse: {
              post: mockPost,
              user: mockUser,
              status: true,
              message: "200: Request successful",
              fileValidProps: {
                fileName: mockPost.fileName,
                imageUrl: mockPost.imageUrl,
                isImageUrlValid: true,
                isFileSizeValid: true,
                isFileTypeValid: true,
                isFileValid: true,
              },
              isContentValid: true,
              isTitleValid: true,
              isPostCreator: true,
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

    // Make sure we have our edit post
    const editPostComponent = screen.getByTestId("test-id-edit-post");
    expect(editPostComponent).toBeVisible();
    expect(editPostComponent).toMatchSnapshot();
  });
});
