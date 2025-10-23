/**
 *
 * Date created: 17/10/2025
 *
 * Author: Nothile Moyo
 *
 * Description: This is the modal component, we use variants of this in our components
 * This is supposed to wrap it so we don't need to reuse our styling in multiple components
 */

import { FC, ReactNode } from "react";
import "./Modal.scss";

interface ModalProps {
  backdrop: boolean;
  children?: ReactNode;
  testId: string;
  variant?: string;
}

/**
 * @name Modal
 *
 * @description - The usable Modal component, it uses variants and other properties to make it modular
 *
 * @param variant: string: "confirmation | error": Defines the variant for content and styling
 * @param backdrop: boolean: Defined whether our modal sticks out or not
 */
const Modal: FC<ModalProps> = ({ children, backdrop = false, testId }) => {
  return (
    <section
      className={`modal ${backdrop && "modal__backdrop"}`}
      data-testid={testId}
    >
      <div className="modal__component">{children}</div>
    </section>
  );
};

export default Modal;
