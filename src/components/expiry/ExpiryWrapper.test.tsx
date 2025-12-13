/**
 * Date created: 12/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Unit tests for expiry wrapper
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import ExpiryWrapper from "./ExpiryWrapper";
import { act } from "react";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("ExpiryWrapper Component", () => {
  it("Successfully shows the component", async () => {
    // Render our component
    const { baseElement } = renderWithoutRouting(
      <ExpiryWrapper lengthInSeconds={1}>
        <div>Expired component</div>
      </ExpiryWrapper>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Delete the component with a timeout", async () => {
    // Render our component
    const { baseElement } = await act(async () => {
      return renderWithoutRouting(
        <ExpiryWrapper lengthInSeconds={1}>
          <div>Expired component</div>
        </ExpiryWrapper>,
        mockContext,
      );
    });

    // Advance time by 2 seconds
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Wait for component to timeout and render null
    expect(baseElement).toMatchSnapshot();
  });
});
