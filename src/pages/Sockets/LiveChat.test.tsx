/**
 * Author: Nothile Moyo
 * Date created: 31/03/2026
 *
 * @description: This is the test file for the live chat component
 * This is to mock the live chat functionality with websockets
 */

import "@testing-library/jest-dom";
import { clearAuthStorage, setMockAuthStorage } from "../../test-utils/authStorage";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { messages, mockContext, mockPosts, mockUser } from "../../test-utils/mocks/objects";
import { act, screen, waitFor } from "@testing-library/react";
import { renderWithContext } from "../../test-utils/testRouter";
import { useNavigate } from "react-router-dom";
import LiveChat from "./LiveChat";

// Assign values so we can mock key functionality in jest instead of actually using components of performing requests
// We mock out fetch so we can hijack the default fetch functionality and replace it with Jest's mocking functionality
let mockFetch: jest.MockedFunction<typeof fetch>;
let mockNavigate = jest.fn();
const socketEventHandlers: Record<string, (_data: unknown) => void> = {};
const originalEnv = process.env;

// ---- Module Mocks ----
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// We need to mock our client as we have to use it for a successful redirect
jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: jest.fn((event: string, handler: (_data: unknown) => void) => {
      socketEventHandlers[event] = handler;
    }),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
}));

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  setMockAuthStorage();

  // Update our mockRouterDOM values
  mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  // Create a new copy of process.env so we an update it
  process.env = { ...originalEnv };
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
  jest.clearAllMocks();

  // Reset our process variable
  process.env = originalEnv;
});

describe("Live Chat component", () => {
  it("Should match snapshot", async () => {
    // Mock our requests here, looks like we have a request to get user details and the chat in the component
    // So we're going to mock both of them here
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostUserDetailsResponse: {
              user: {
                _id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                confirmPassword: mockUser.password,
                status: true,
                posts: mockPosts[0],
              },
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            chatMessagesResponse: {
              success: true,
              messages: messages,
              error: null,
            },
          },
        }),
      );

    // We render our component with the mocked requests
    await act(async () => {
      renderWithContext(<LiveChat />, { route: "/livechat" }, mockContext);
    });

    // Check if the view posts component is rendered and we navigate to it successfully
    const message = await screen.findByTestId(messages.messages[0]._id);
    expect(message).toBeInTheDocument();

    const appComponent = await screen.findByTestId("test-id-livechat-page");
    expect(appComponent).toBeInTheDocument();
    expect(appComponent).toMatchSnapshot();
  });

  // Should establish a connection and send a message
  it("Should send a message from the live socket", async () => {
    // We'll set the environment to development here
    Object.defineProperties(process.env, {
      NODE_ENV: {
        value: "development",
        writable: true,
        configurable: true,
      },
    });

    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostUserDetailsResponse: {
              user: {
                _id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                confirmPassword: mockUser.password,
                status: true,
                posts: mockPosts[0],
              },
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            chatMessagesResponse: {
              success: true,
              messages: messages,
              error: null,
            },
          },
        }),
      );

    // We render our component with the mocked requests
    await act(async () => {
      renderWithContext(<LiveChat />, { route: "/livechat" }, mockContext);
    });

    // Fire the "post added" socket event with a mock post payload
    // Since we handle the object we get back directly, we need to make sure to fire it
    await act(async () => {
      socketEventHandlers["message sent"]({
        _id: "message-test-id-5",
        message: "Fifth",
        dateSent: "2026-04-06 22:10:53",
        sender: mockUser.name,
        senderId: mockUser._id,
      });
    });

    // We'll add the message to the page and make sure it's visible
    await waitFor(() => {
      const toast = screen.getByText(`Fifth`);
      expect(toast).toBeVisible();
    });
  });

  it("Should send the request for user details with no token", async () => {
    // Create a mock context without a token
    // This test is for coverage, not functionality
    const contextWithoutToken = {
      ...mockContext,
      token: undefined,
    };

    // Mock our requests here, looks like we have a request to get user details and the chat in the component
    // So we're going to mock both of them here
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            PostUserDetailsResponse: {
              user: {
                _id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                confirmPassword: mockUser.password,
                status: true,
                posts: mockPosts[0],
              },
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          data: {
            chatMessagesResponse: {
              success: true,
              messages: messages,
              error: null,
            },
          },
        }),
      );

    // We render our component with the mocked requests
    await act(async () => {
      renderWithContext(<LiveChat />, { route: "/livechat" }, contextWithoutToken);
    });

    // Check if the view posts component is rendered and we navigate to it successfully
    const message = await screen.findByTestId(messages.messages[0]._id);
    expect(message).toBeInTheDocument();
  });

  it("It triggers the catch block", async () => {
    // We're ignoring the console in this test as we don't need the output here, but is useful for dev / prod
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock our requests here, looks like we have a request to get user details and the chat in the component
    // So we're going to mock both of them here
    mockFetch.mockRejectedValue(new Error("Network failed"));

    // We render our component with the mocked requests
    await act(async () => {
      renderWithContext(<LiveChat />, { route: "/livechat" }, mockContext);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });

    consoleErrorSpy.mockRestore();
  });

  it("Should render messages when user details fail but chat loads", async () => {
    // We're ignoring the console in this test as we don't need the output here, but is useful for dev / prod
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // We're going to mock failing to get the userDetails
    mockFetch.mockRejectedValueOnce(new Error("Network failed")).mockResolvedValueOnce(
      createFetchResponse({
        data: {
          chatMessagesResponse: {
            success: true,
            messages: messages,
            error: null,
          },
        },
      }),
    );

    // We render our component with the mocked requests
    await act(async () => {
      renderWithContext(<LiveChat />, { route: "/livechat" }, mockContext);
    });

    // Check if the view posts component is rendered and we navigate to it successfully
    const message = await screen.findByTestId(messages.messages[0]._id);
    expect(message).toBeInTheDocument();

    // Reset the mock
    consoleErrorSpy.mockRestore();
  });
});
