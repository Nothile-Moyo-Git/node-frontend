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
import { renderWithContext } from "../../test-utils/testRouter";
import { screen } from "@testing-library/react";
import { ViewPosts } from "./ViewPosts";
import { mockContext } from "../../test-utils/objects/objects";

// Setup mocks and environment
beforeAll(() => server.listen());

beforeEach(() => {
  setMockAuthStorage();
});

// Cleanup mocks and environment
afterEach(() => {
  server.resetHandlers();
  clearAuthStorage();
});

afterAll(() => server.close());

describe("View Posts component", () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: true,
          },
        },
      }),
  });

  renderWithContext(<ViewPosts />, { route: "/posts" }, mockContext);

  // Check if the view posts component is rendered and we navigate to it successfully
  const appComponent = screen.getByTestId("test-id-view-posts");
  expect(appComponent).toBeInTheDocument();
  expect(appComponent).toMatchSnapshot();
});
