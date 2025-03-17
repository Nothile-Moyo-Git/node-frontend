/**
 *
 * Date created: 26/02/2024
 * Author: Nothile Moyo
 *
 * Field component, this component wraps a field in any forms that we have
 * The field component has custom styling attached to it
 */

import "./Field.scss";

import { FC, ReactNode } from "react";

interface ComponentProps {
  children: ReactNode;
  position?: string;
}

const Field: FC<ComponentProps> = ({ children, position }) => {
  // Set the classname for the fields for differnet types of forms
  const fieldClassNames = position === "bottom" ? "field__bottom" : "";

  return <div className={`field ${fieldClassNames}`}>{children}</div>;
};

export default Field;
