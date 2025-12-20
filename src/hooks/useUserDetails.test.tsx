/**
 *
 * Author: Nothile Moyo
 *
 * Date created: 28/11/2025
 *
 * Description: Unit tests for the useUserSession hook
 */

import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { mockContext, mockUser } from "../test-utils/mocks/objects";
import { AppContext, ContextProps } from "../context/AppContext";
import useUserDetails from "./useUserDetails";
import { createFetchResponse } from "../test-utils/methods/methods";
import { generateUploadDate } from "../util/util";
import { checkSessionValidation } from "../util/util";

const mockExpiryDate = generateUploadDate(new Date(Date.now() + 12096e5).toISOString());
const mockCreationDate = generateUploadDate(new Date(Date.now()).toISOString());

// Mock checkSessionValidation
jest.mock("../util/util", () => ({
  ...jest.requireActual("../util/util"),
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

const failedMockContext: ContextProps = {
  ...mockContext,
  token: undefined,
};

// Mock our content wrapper since we'll pass the child elements inside of it
const wrapper = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={validatedMockContext}>{children}</AppContext.Provider>;
};

describe("useUserSession Hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Handles the loading spinner successfully", async () => {
    console.log("Current test: Handles the loading spinner successfully");

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
    const { result } = renderHook(() => useUserDetails(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(false);

    // Handle our state updates in the hook
    await waitFor(() => {
      expect(result.current.user?.name).toBe(mockUser.name);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.sessionCreated).toBe(mockCreationDate);
      expect(result.current.sessionExpires).toBe(mockExpiryDate);
    });
  });

  it("Handles an unsuccessful request", async () => {
    console.log("Current test: Handles the loading spinner successfully");

    // Mock our request for predictable values
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: mockCreationDate,
            sessionExpires: mockExpiryDate,
            user: mockUser,
            success: false,
          },
        },
      }),
    );

    const { result } = renderHook(() => useUserDetails(), { wrapper });

    // Handle our state updates in the hook
    await waitFor(() => {
      expect(result.current.error).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("Fails the request and triggers the catch block with a console", async () => {
    console.log("Current test: Fails the request and triggers the catch block with a console");

    // Mock our request for predictable values
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Request failed"));

    // Suppress console noise during test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useUserDetails(), { wrapper });

    // Wait for React to finish async updates
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(true);
      expect(result.current.user).toBe(null);
    });

    // Restore console
    consoleSpy.mockRestore();
  });

  it("Calls checkSessionValidation when user is authenticated with token", async () => {
    console.log("Current test: Calls checkSessionValidation when user is authenticated with token");
    // Set up fetch success response
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

    const { result } = renderHook(() => useUserDetails(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Expect hook to call validation
    expect(checkSessionValidation).toHaveBeenCalledWith(mockContext.userId, mockContext.token, mockContext.baseUrl);
  });

  it("Validates the user but doesn't call checkSessionValidation", async () => {
    console.log("Current test: Validates the user but doesn't call checkSessionValidation");
    // Set up fetch success response
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

    // Mock our content wrapper since we'll pass the child elements inside of it
    const wrapper = ({ children }: { children: ReactNode }) => {
      return <AppContext.Provider value={failedMockContext}>{children}</AppContext.Provider>;
    };
    const { result } = renderHook(() => useUserDetails(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Expect hook to call validation
    expect(checkSessionValidation).not.toHaveBeenCalled();
  });

  it("Does not fetch when user is authenticated but missing userId", async () => {
    console.log("Current test: Does not fetch when user is authenticated but missing userId");
    const missingUserIdContext = {
      ...mockContext,
      userAuthenticated: true,
      userId: undefined,
      token: "fake-token",
      validateAuthentication: jest.fn(),
    };

    const wrapperMissingId = ({ children }: { children: ReactNode }) => (
      <AppContext.Provider value={missingUserIdContext}>{children}</AppContext.Provider>
    );

    const { result } = renderHook(() => useUserDetails(), { wrapper: wrapperMissingId });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(false);
    expect(checkSessionValidation).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("Skips fetching and validation when user is not authenticated", async () => {
    console.log("Current test: Skips fetching and validation when user is not authenticated");

    const unauthenticatedContext: ContextProps = {
      ...mockContext,
      userAuthenticated: false,
      token: "fake-token",
      userId: "12345-nothile-id",
      validateAuthentication: jest.fn(),
    };

    const wrapperUnauth = ({ children }: { children: ReactNode }) => (
      <AppContext.Provider value={unauthenticatedContext}>{children}</AppContext.Provider>
    );

    const { result } = renderHook(() => useUserDetails(), { wrapper: wrapperUnauth });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(checkSessionValidation).not.toHaveBeenCalled();
      expect(result.current.error).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  it("Does not call checkSessionValidation when token is missing", async () => {
    console.log("Current test: Does not call checkSessionValidation when token is missing");

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

    const contextWithoutToken = { ...mockContext, token: undefined, userId: "12345", userAuthenticated: true };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AppContext.Provider value={contextWithoutToken}>{children}</AppContext.Provider>
    );

    const { result } = renderHook(() => useUserDetails(), { wrapper });

    await waitFor(() => {
      expect(checkSessionValidation).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("Calls getUserDetails and handles response correctly", async () => {
    console.log("Current test: getUserDetails is called");

    // Spy on fetch
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(
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

    const { result } = renderHook(() => useUserDetails(), { wrapper });

    // Wait for hook to finish async updates
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

      // Assert that fetch (and thus getUserDetails) was called
      expect(fetchSpy).toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });

  it("Handles missing AppContext without throwing and skips all actions", async () => {
    console.log("Current test: Handles missing AppContext without throwing and skips all actions");

    // Render the hook without the wrapper
    const { result } = renderHook(() => useUserDetails());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.error).toBe(false);
      expect(result.current.sessionCreated).toBe("");
      expect(result.current.sessionExpires).toBe("");
    });
  });
});
