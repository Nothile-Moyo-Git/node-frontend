/**
 * Date created: 15/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Label for the field component
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Label from "./Label";
import { screen } from "@testing-library/react";

describe("Label Component", () => {
  it("Matches the snapshot", async () => {
    // Render the base element
    const { baseElement } = renderWithoutRouting(
      <Label htmlFor="test-label" id="test-label" testId="test-id-input-label">
        <div>Children</div>
      </Label>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Show the error styling", async () => {
    // Render the base element
    renderWithoutRouting(
      <Label htmlFor="test-label" id="test-label" testId="test-id-input-label" error={true} errorText="Error">
        <div>Children</div>
      </Label>,
      mockContext,
    );

    const errorText = screen.getByText("Error");
    expect(errorText).toBeVisible();
  });
});
