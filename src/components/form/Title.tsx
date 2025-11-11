/**
 *
 * Date created: 26/02/2024
 * Author: Nothile Moyo
 *
 * Title component, this component renders the title of the form
 *
 */

import "./Title.scss";

import { FC, ReactNode } from "react";

interface ComponentProps {
  isFormValid?: boolean;
  children: ReactNode;
}

const Title: FC<ComponentProps> = ({ isFormValid, children }) => {
  return <h2 className={`title ${isFormValid === false && "title__error"}`}>{children}</h2>;
};

export default Title;
