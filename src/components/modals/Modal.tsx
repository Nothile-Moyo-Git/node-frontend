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
import ErrorIcon from "../icons/ErrorIcon";
import "./Modal.scss";

type ModalProps = {
  children?: ReactNode;
  variant: string;
  backdrop: boolean;
};

/**
 * @name Modal
 *
 * @description - The usable Modal component, it uses variants and other properties to make it modular
 *
 * @param variant: string: "confirmation | error": Defines the variant for content and styling
 * @param backdrop: boolean: Defined whether our modal sticks out or not
 */
const Modal: FC<ModalProps> = ({
  children,
  variant = "confirmation",
  backdrop = false,
}) => {
  // Error component that we can inject into our component
  const errorSection = (
    <div className="modal__error">
      <ErrorIcon />
      <h2>Oops!</h2>
      <p>Something went wrong and your request was not completed.</p>
      <p>Please reload the page or email me using the button below.</p>
      <a
        className="errorModal__button"
        href="mailto:@nottsthrowaway1@gmail.com"
      >
        Email me
      </a>
    </div>
  );

  return (
    <section className={`modal ${backdrop && "modal__backdrop"}`}>
      <div className="modal__component">
        {variant === "error" && errorSection}
        {children}
      </div>
    </section>
  );
};

export default Modal;
