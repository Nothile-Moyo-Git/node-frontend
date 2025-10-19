/**
 *
 * Date created: 17/10/2025
 *
 * Author: Nothile Moyo
 *
 * Description: This is the modal component, we use variants of this in our components
 * This is supposed to wrap it so we don't need to reuse our styling in multiple components
 */

import { FC, ReactNode, useState, useEffect } from "react";
import "./Modal.scss";

type ModalProps = {
  children: ReactNode;
  variant: string;
};

const Modal: FC<ModalProps> = ({ children, variant = "confirmation" }) => {
  const [chosenVariant, setChosenVariant] = useState<string>(variant);
  const [variantStylingClasses, setVariantStylingClasses] = useState<string>();

  // We're going to determine how we're going to style our modal and what content we pass through here
  useEffect(() => {
    switch (variant) {
      case "confirmation":
        setChosenVariant(variant);
        setVariantStylingClasses("modal__confirmation");
        break;
      case "error":
        setChosenVariant(variant);
        setVariantStylingClasses("modal__error");
        break;
      default:
        setChosenVariant("confirmation");
        setVariantStylingClasses("modal__confirmation");
        break;
    }
  }, [variant]);

  return (
    <section className={`modal ${variantStylingClasses}`}>{children}</section>
  );
};

export default Modal;
