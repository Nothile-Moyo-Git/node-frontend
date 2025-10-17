/**
 *
 * Date created : 24/06/2024
 *
 * Author : Nothile Moyo
 *
 * Description : A simple toast notification modal
 */

import { FC, useState, useEffect, ReactElement, ReactNode } from "react";
import { SiTicktick } from "react-icons/si";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import "./ToastModal.scss";

interface ComponentProps {
  variant?: string;
  customMessage?: string;
  children?: ReactNode;
}

/**
 * @name ToastModal
 *
 * @param variant ?: string
 * @param customMessage ?: string
 *
 * @description : A toast modal which has color variants
 */
const ToastModal: FC<ComponentProps> = ({
  variant = "info",
  customMessage,
  children,
}) => {
  // Variables to set state
  const [toastStyles, setToastStyles] = useState<string>(``);
  const [defaultToastMessage, setDefaultToastMessage] = useState<string>(
    `Your request has been processed`,
  );
  const [icon, setIcon] = useState<ReactElement>(
    <IoMdInformationCircleOutline />,
  );

  // We set the styling and icons based on the variant
  useEffect(() => {
    switch (variant) {
      case "success":
        setToastStyles("toast--success");
        setDefaultToastMessage(`Your request has been successful`);
        setIcon(<SiTicktick />);
        break;

      case "post added":
        setToastStyles("toast--info");
        setDefaultToastMessage(`New post has been added`);
        setIcon(<IoMdInformationCircleOutline />);
        break;

      case "info":
        setToastStyles("toast--info");
        setDefaultToastMessage(`Your request has been processed`);
        setIcon(<IoMdInformationCircleOutline />);
        break;

      case "error":
        setToastStyles("toast--error");
        setDefaultToastMessage(`There has been an error with your request`);
        setIcon(<MdError />);
        break;

      case "warning":
        setToastStyles("toast--warning");
        setDefaultToastMessage(
          `Your request was successful, but should be doublechecked.`,
        );
        setIcon(<IoIosWarning />);
        break;

      default:
        setToastStyles("toast--info");
        setDefaultToastMessage(`Your request has been processed`);
        setIcon(<IoMdInformationCircleOutline />);
        break;
    }
  }, [variant]);

  return (
    <div className={`toast ${toastStyles}`}>
      <div className="toast__modal">
        <span className="toast__message">
          {icon}
          {customMessage ? customMessage : defaultToastMessage}
        </span>
        {children && children}
      </div>
      <span className="toast__bar" />
    </div>
  );
};

export default ToastModal;
