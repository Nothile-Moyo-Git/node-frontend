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
  children?: ReactNode;
  variant?: string;
  backdrop: boolean;
}

/**
 * @name Modal
 *
 * @description - The usable Modal component, it uses variants and other properties to make it modular
 *
 * @param variant: string: "confirmation | error": Defines the variant for content and styling
 * @param backdrop: boolean: Defined whether our modal sticks out or not
 */
const Modal: FC<ModalProps> = ({ children, backdrop = false }) => {
  return (
    <section className={`modal ${backdrop && "modal__backdrop"}`}>
      <div className="modal__component">{children}</div>
    </section>
  );
};

export default Modal;
