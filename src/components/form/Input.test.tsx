/**
 * Date created: 15/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Input for the field component
 * These tests really arent necessary, they're just good for coverage
 */

import React from "react";
import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Input from "./Input";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Input Component", () => {
  it("Matches the snapshot", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const inputRef = React.createRef<HTMLInputElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    const { baseElement } = renderWithoutRouting(
      <Input error={false} name="test" ref={inputRef} type="textarea" testId="test-id-test-input" />,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders a square input", () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const inputRef = React.createRef<HTMLInputElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    renderWithoutRouting(
      <Input error={false} name="test" ref={inputRef} type="textarea" testId="test-id-test-input" square={true} />,
      mockContext,
    );

    // Reference the input component
    const inputComponent = screen.getByTestId("test-id-test-input");

    expect(inputComponent).toBeVisible();
  });

  it("Renders an error", () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const inputRef = React.createRef<HTMLInputElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    renderWithoutRouting(
      <Input error={true} name="test" ref={inputRef} type="textarea" testId="test-id-test-input" square={true} />,
      mockContext,
    );

    // Grab our input component
    const inputComponent = screen.getByTestId("test-id-test-input");

    expect(inputComponent).toBeVisible();
  });

  it("Updates the content of the input", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const inputRef = React.createRef<HTMLInputElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    renderWithoutRouting(
      <Input
        error={true}
        name="test"
        ref={inputRef}
        type="textarea"
        testId="test-id-test-input"
        square={true}
        onChange={jest.fn()}
      />,
      mockContext,
    );

    // Grab our input component and update the content
    const inputComponent = screen.getByTestId("test-id-test-input");
    userEvent.type(inputComponent, "content");

    expect(inputComponent).toHaveValue("content");
  });
});
