/**
 * Date created: 20/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Tests for the error modal to ensure it renders properly
 */

import { mockContext } from "../../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../../test-utils/testRouter";
import ToastModal from "./ToastModal";
import { screen } from "@testing-library/react";

describe("Toast modal", () => {
  it("Matches the snapshot", () => {
    // Render the modal with the default values
    const { baseElement } = renderWithoutRouting(<ToastModal />, mockContext);

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders a custom toast message and children", () => {
    //
    renderWithoutRouting(
      <ToastModal variant="info" customMessage="Toast message">
        {"children"}
      </ToastModal>,
      mockContext,
    );

    // Find the test based on the custom message
    const toastMessage = screen.getByText("Toast message");

    expect(toastMessage).toBeVisible();
  });

  // Here we render all variants
  const variants = ["success", "post added", "info", "error", "warning", "default"];
  variants.forEach((variant) => {
    it(`Renders variant: ${variant}`, () => {
      const { baseElement } = renderWithoutRouting(<ToastModal variant={variant} />, mockContext);

      expect(baseElement).toMatchSnapshot();
    });
  });
});
