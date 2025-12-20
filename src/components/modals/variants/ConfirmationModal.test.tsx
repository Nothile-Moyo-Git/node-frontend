/**
 * Date created: 19/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the ConfmrationModal component
 * This tests the functionality of the confirmationModal component and it's resposnive functions and visibility
 */

import userEvent from "@testing-library/user-event";
import { mockContext } from "../../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../../test-utils/testRouter";
import ConfirmationModal from "./ConfirmationModal";
import { screen } from "@testing-library/react";
import { act } from "react";

describe("Confirmation Modal Component", () => {
  it("Matches the snapshot", () => {
    // Mock the functionality that our state update would execute
    const toggleMenuMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback();
      }
    });
    // Get the reference of the input to confirmation modal
    const { baseElement } = renderWithoutRouting(
      <ConfirmationModal
        id="test-id"
        testId="test-id-confirmation-modal"
        toggleConfirmationModal={toggleMenuMock}
      ></ConfirmationModal>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Triggers toggleConfirmationModal", async () => {
    // Mock the functionality that our state update would execute
    const toggleMenuMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback();
      }
    });
    // Get the reference of the input to confirmation modal
    const { baseElement } = renderWithoutRouting(
      <ConfirmationModal
        id="test-id"
        testId="test-id-confirmation-modal"
        toggleConfirmationModal={toggleMenuMock}
      ></ConfirmationModal>,
      mockContext,
    );

    const confirmationButton = screen.getByTestId("test-id-confirmation-modal-cancel-button");
    await act(async () => {
      userEvent.click(confirmationButton);
    });

    expect(toggleMenuMock).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it("Triggers performAction", async () => {
    // Mock the functionality that our state update would execute
    // This infers the types in the callback
    const toggleMenuMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback();
      }
    });

    const performActionMock = jest.fn(() => {
      return () => {};
    });

    // Get the reference of the input to confirmation modal
    const { baseElement } = renderWithoutRouting(
      <ConfirmationModal
        id="test-id"
        testId="test-id-confirmation-modal"
        toggleConfirmationModal={toggleMenuMock}
        performAction={performActionMock}
      ></ConfirmationModal>,
      mockContext,
    );

    const actionButton = screen.getByTestId("test-id-confirmation-modal-confirm-button");
    await act(async () => {
      userEvent.click(actionButton);
    });

    expect(performActionMock).toHaveBeenCalled();

    expect(baseElement).toMatchSnapshot();
  });
});
