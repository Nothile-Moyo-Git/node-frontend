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

type ModalProps = {
  children: ReactNode;
  variant: string;
  backdrop: boolean;
};

/**
 * @name Modal
 *
 * @description - The usable Modal component, it uses variants and other properties to make it modular
 *
 * @param variant: string
 * @param backdrop: boolean
 */
const Modal: FC<ModalProps> = ({
  children,
  variant = "confirmation",
  backdrop = false,
}) => {
  return (
    <section className={`modal ${backdrop && "modal__backdrop"}`}>
      <div className="modal__component">
        {variant === "error" && <p>Error icon goes here</p>}
        {children}
      </div>
    </section>
  );
};

export default Modal;
