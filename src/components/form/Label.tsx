/**
 *
 * Date created: 24/03/2024
 * Author: Nothile Moyo
 *
 * Label component
 *
 * This component is designed to be a re-usable label component for forms
 * Props passed through to this component will represent the HTML properties of the element
 */

import { FC, ReactNode } from "react";

import "./Label.scss";

interface ComponentProps {
  children: ReactNode;
  htmlFor: string;
  id: string;
  error?: boolean;
  errorText?: string;
}

/**
 * @method Label
 * @description Label component. Use this component instead of a label when building forms
 *
 * @param children : ReactNode
 * @param id : string
 * @param htmlFor : string
 * @param error : boolean
 * @param errorText ?: string
 */
const Label: FC<ComponentProps> = ({
  children,
  id,
  htmlFor,
  error,
  errorText,
}) => {
  return (
    <label
      id={id}
      htmlFor={htmlFor}
      className={`label ${error && "label__error"}`}
    >
      {error ? errorText : children}
    </label>
  );
};

export default Label;
