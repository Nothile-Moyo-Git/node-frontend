/**
 * Date created: 19/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the Modal component
 * This tests the functionality of the Modal component and it's resposnive functions and visibility
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Modal from "./Modal";

describe("Modal Component", () => {
  it("Matches the snapshot", () => {
    // Get our element
    const { baseElement } = renderWithoutRouting(
      <Modal backdrop testId="test-id-modal-backdrop">
        {"children"}
      </Modal>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Doesn't render the backdrop", () => {
    // Get our element
    const { baseElement } = renderWithoutRouting(
      <Modal backdrop={false} testId="test-id-modal-backdrop">
        {"children"}
      </Modal>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders the default bakdrop", () => {
    // Get our element
    // We don't pass anything here so it uses the default parameter for backdrop
    const { baseElement } = renderWithoutRouting(
      <Modal testId="test-id-modal-backdrop">{"children"}</Modal>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
