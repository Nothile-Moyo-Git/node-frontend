/**
 *
 * Author: Nothile Moyo
 *
 * Date created: 28/11/2025
 *
 * Description: Unit tests for the useUserSession hook
 */

import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { mockContext } from "../test-utils/mocks/objects";
import { AppContext } from "../context/AppContext";
import useUserDetails from "./useUserDetails";

// Mock checkSessionValidation
jest.mock("../util/util", () => ({
  ...jest.requireActual("../util/util"),
  checkSessionValidation: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock our content wrapper since we'll pass the child elements inside of it
const wrapper = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={mockContext}>{children}</AppContext.Provider>;
};

describe("useUserSession Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial loading state", () => {
    const { result } = renderHook(() => useUserDetails(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(false);
  });

  /* it("handles successful user fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          data: {
            PostUserDetailsResponse: {
              user: { name: "Nothile", status: "active" },
              success: true,
              sessionCreated: "2024",
              sessionExpires: "2025",
            },
          },
        }),
    });

    const { result } = renderHook(() => useUserSession(), { wrapper });

    await act(async () => {});

    expect(result.current.user?.name).toBe("Nothile");
    expect(result.current.error).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error if backend returns success: false", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          data: { PostUserDetailsResponse: { success: false } },
        }),
    });

    const { result } = renderHook(() => useUserSession(), { wrapper });

    await act(async () => {});

    expect(result.current.error).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error if validateAuthentication throws", async () => {
    mockContext.validateAuthentication = jest.fn(() => {
      throw new Error("Auth failed");
    });

    const { result } = renderHook(() => useUserSession(), { wrapper });

    await act(async () => {});

    expect(result.current.error).toBe(true);
  });

  it("does NOT call session validation if missing token", async () => {
    const contextWithoutToken = { ...mockContext, token: undefined };

    const { result } = renderHook(() => useUserSession(), {
      wrapper: ({ children }) => (
        <AppContext.Provider value={contextWithoutToken as any}>{children}</AppContext.Provider>
      ),
    });

    await act(async () => {});

    expect(checkSessionValidation).not.toHaveBeenCalled();
  });

  it("does NOT call getUserDetails if missing userId", async () => {
    const contextWithoutId = { ...mockContext, userId: undefined };

    const { result } = renderHook(() => useUserSession(), {
      wrapper: ({ children }) => <AppContext.Provider value={contextWithoutId as any}>{children}</AppContext.Provider>,
    });

    await act(async () => {});

    expect(global.fetch).not.toHaveBeenCalled();
  }); */
});
