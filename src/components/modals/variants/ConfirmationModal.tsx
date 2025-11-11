/**
 * Date created: 22/10/2025
 *
 * Author: Nothile Moyo
 *
 * Confirmation Modal component
 * This component is a confirmation modal which renders in the middle of the page
 * The component will take an onclick handler for the previous function, and have a cancel button
 * This component will be used for things such as deleting a post etc...
 */

import { FC } from "react";
import Modal from "../Modal";
import Button from "../../button/Button";

interface ComponentProps {
  id: string;
  performAction?: () => void;
  testId: string;
  toggleConfirmationModal: (_id: string) => void;
}

const ConfirmationModal: FC<ComponentProps> = ({ id, performAction, testId, toggleConfirmationModal }) => {
  return (
    <Modal variant="none" backdrop={true} testId={testId}>
      <div className="modal__confirmation">
        <h2>Are you sure?</h2>
        <p>
          If you wish to complete this action, click on the confirm button. If you&apos;d like to cancel, click on
          cancel
        </p>
        <p>Please know that this action is NOT REVERSIBLE.</p>
        <div className="modal__confirmation-buttons">
          <Button variant="primary" onClick={performAction} testId="test-id-confirmation-modal-confirm-button">
            Confirm
          </Button>
          <Button
            variant="delete"
            onClick={() => toggleConfirmationModal(id)}
            testId="test-id-confirmation-modal-cancel-button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
