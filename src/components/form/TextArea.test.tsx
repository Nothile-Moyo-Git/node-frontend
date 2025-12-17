/**
 * Date created: 16/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the TextArea component
 * Tests basic functionality
 */

import React from "react";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import { mockContext } from "../../test-utils/mocks/objects";
import TextArea from "./TextArea";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Textarea Component", () => {
  it("Matches the snapshot", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const textAreaRef = React.createRef<HTMLTextAreaElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    const { baseElement } = renderWithoutRouting(
      <TextArea
        ariaLabelledBy="test-textarea-label"
        error={false}
        name="textarea"
        placeholder="Placeholder"
        required
        ref={textAreaRef}
        startingRows={1}
        testId="test-id-text-area"
      >
        <p>Children</p>
      </TextArea>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders an error", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const textAreaRef = React.createRef<HTMLTextAreaElement>();

    const { baseElement } = renderWithoutRouting(
      <TextArea
        ariaLabelledBy="test-textarea-label"
        error={true}
        initialValue="Initial value"
        name="textarea"
        placeholder="Placeholder"
        required
        ref={textAreaRef}
        square
        testId="test-id-text-area"
      >
        <p>Children</p>
      </TextArea>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Updates the text area input", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const textAreaRef = React.createRef<HTMLTextAreaElement>();

    renderWithoutRouting(
      <TextArea
        ariaLabelledBy="test-textarea-label"
        error={true}
        initialValue="Initial value"
        name="textarea"
        placeholder="Placeholder"
        required
        ref={textAreaRef}
        square
        testId="test-id-text-area"
      >
        <p>Children</p>
      </TextArea>,
      mockContext,
    );

    // Check initial value
    const element = screen.getByTestId("test-id-text-area");
    expect(element).toHaveValue("Initial value");

    userEvent.clear(element);
    expect(element).not.toHaveValue();
  });
});
