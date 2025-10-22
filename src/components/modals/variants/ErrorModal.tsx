/**
 *
 * Date created: 06/05/2024
 *
 * Author: Nothile Moyo
 *
 * ErrorModal component
 * This component will be used to render a modal which will state that the request has failed
 */

import { FC } from "react";
import Modal from "../Modal";
import ErrorIcon from "../../icons/ErrorIcon";

/**
 * @name ErrorModal: ReactNode
 *
 * @description - A variation of the Error Modal component
 */
const ErrorModal: FC = () => {
  return (
    <Modal backdrop={false} variant="none">
      <div className="modal__error">
        <ErrorIcon />
        <h2>Oops!</h2>
        <p>Something went wrong and your request was not completed.</p>
        <p>Please reload the page or email me using the button below.</p>
        <a
          className="modal__error-button"
          href="mailto:@nottsthrowaway1@gmail.com"
        >
          Email me
        </a>
      </div>
    </Modal>
  );
};

export default ErrorModal;
