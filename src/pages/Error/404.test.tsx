/**
 * Date created: 06/01/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Render the 404 page
 */

import { useNavigate } from "react-router-dom";
import { renderWithContext } from "../../test-utils/testRouter";
import { ErrorPage } from "./404";
import { mockContext, mockUser } from "../../test-utils/mocks/objects";
import { act } from "react";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { generateUploadDate } from "../../util/util";

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// ---- Test Setup Values ----
const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

// Get the mocked version of useNavigate
let mockNavigate: jest.Mock;

describe("Signup", () => {
  beforeEach(() => {
    // Mock the result, and then mock the behavior that occurs if useNavigate is called
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Matches the snapshot", async () => {
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
    // Render the error page in order to generate a snapshot
    const { baseElement } = await act(() => renderWithContext(<ErrorPage />, {}, mockContext));

    expect(baseElement).toMatchSnapshot();
  });

  /* it("Handles the back link being clicked on", () => {
    renderWithContext(<ErrorPage />, {}, mockContext);
  }); */
});
