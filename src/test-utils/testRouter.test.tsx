/**
 *
 * Author: Nothile Moyo
 *
 * Description: This is to test the testRouting file in order to manage the arguments properly
 * It covers passing custom or default routes through, and helps with coverage
 * This is more for coverage than explicitly useful testing
 */

// testRouter.test.tsx
import { renderWithRouter, renderWithContext, renderWithAct, renderWithoutRouting } from "./testRouter";
import { mockContext } from "./mocks/objects";
import { screen } from "@testing-library/react";
import { createFetchResponse } from "./methods/methods";
import { generateUploadDate } from "../util/util";
import { mockUser } from "./mocks/objects";
import { act } from "react";
import App from "../App";

// ---- Test Setup Values ----
const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

describe("testRouter utilities", () => {
  it("renderWithRouter - with route", () => {
    const { baseElement } = renderWithRouter(<App />, { route: "/" });
    expect(baseElement).toBeVisible();
  });

  it("renderWithRouter - default route", () => {
    const { baseElement } = renderWithRouter(<App />);
    expect(baseElement).toBeVisible();
  });

  it("renderWithContext - with route", async () => {
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

    // We're wrapping our router in an act intentionally so we can update our state from our mocked request
    await act(() => renderWithContext(<App />, { route: "/" }, mockContext));

    // Make sure our component renders
    const component = screen.getByTestId("test-id-app-component");
    expect(component).toBeVisible();
  });

  it("renderWithContext - empty route", async () => {
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

    // We're wrapping our router in an act intentionally so we can update our state from our mocked request
    await act(() => renderWithContext(<App />, {}, mockContext));

    // Make sure our component renders
    const component = screen.getByTestId("test-id-app-component");
    expect(component).toBeVisible();
  });

  it("renderWithContext - default route", async () => {
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

    // We're wrapping our router in an act intentionally so we can update our state from our mocked request
    await act(() => renderWithContext(<App />, undefined, mockContext));

    // Make sure our component renders
    const component = screen.getByTestId("test-id-app-component");
    expect(component).toBeVisible();
  });

  it("renderWithAct - with route", async () => {
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
    await renderWithAct(<App />, { route: "/" }, mockContext);

    // Make sure our component renders
    const component = screen.getByTestId("test-id-app-component");
    expect(component).toBeVisible();
  });

  it("renderWithAct - default route", async () => {
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
    await renderWithAct(<App />, undefined, mockContext);

    // Make sure our component renders
    const component = screen.getByTestId("test-id-app-component");
    expect(component).toBeVisible();
  });

  it("renderWithoutRouting - renders in isolation", async () => {
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
    await act(() => renderWithoutRouting(<App />, mockContext));
  });
});
