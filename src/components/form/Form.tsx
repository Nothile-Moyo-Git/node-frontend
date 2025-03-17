/**
 *
 * Date created: 25/02/2024
 * Author: Nothile Moyo
 *
 * Form wrapper component
 * This component wraps the form in a responsive manner, and applies the appropriate styling to it
 *
 */

import { FC, FormEvent, ReactNode } from "react";

import "./Form.scss";

/**
 * @name Form
 *
 * @description A "Form" wrapper component, use this isntead of a regular form
 */

interface ComponentProps {
  size?: string;
  children: ReactNode;
  isFormValid?: boolean;
  onSubmit: (_event: FormEvent) => void;
}

/**
 * @name Form
 *
 * @description Form component, serves as a wrapper for forms with the styling and error handling
 *
 * @param children : ReactNode
 * @param isFormValid ?: boolean
 * @param onSubmit : (event: FormEvent) => void
 */
const Form: FC<ComponentProps> = ({
  size,
  children,
  isFormValid,
  onSubmit,
}) => {
  // Set the size of the form
  let formStyles = "";

  switch (size) {
    case "full":
      formStyles = "form__full";
      break;
    default:
      formStyles = "";
      break;
  }

  return (
    <form
      className={`form ${formStyles} ${isFormValid === false && "form__error"}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

export default Form;
