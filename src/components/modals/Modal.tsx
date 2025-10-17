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
};

const Modal: FC<ModalProps> = ({ children }) => {
  return <section className="modal">{children}</section>;
};

export default Modal;
