/**
 * Author: Nothile Moyo
 *
 * Date created: 04/12/2025
 *
 * Description: Tests for the button component, this tests the button being able to render with the correct details
 * These tests aren't necessary, but they help hit coverage metrics
 */

import Button from "./Button";
import { render } from "@testing-library/react";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
});

describe("Edit Post Component", () => {
  it("Renders the button and matches the snapshot", () => {
    // We render our button here, we can extract screen methods from the render method is we destrust the object that's
    const { baseElement, getByTestId } = render(<Button testId="test-id-test-button">Click me!</Button>);

    const buttonElement = getByTestId("test-id-test-button");

    // Check button details
    expect(buttonElement).toHaveTextContent("Click me!");
    expect(buttonElement).toBeVisible();
    expect(baseElement).toMatchSnapshot();
  });

  const variants = ["primary", "secondary", "menu", "error", "delete", "back", "square"];

  variants.forEach((variant) => {
    it(`renders correctly with variant="${variant}"`, () => {
      const { baseElement } = render(
        <Button testId={`btn-${variant}`} variant={variant}>
          Click me!
        </Button>,
      );

      expect(baseElement).toMatchSnapshot();
    });
  });
});
