/**
 *
 * Date created : 23/06/2024
 *
 * Author : Nothile Moyo
 *
 * Description : A component which expires after a certain number of seconds such as a modal or toast component
 */

import { FC, ReactElement, useEffect, useState } from "react";

interface ComponentProps {
  lengthInSeconds: number;
  children: ReactElement;
}

/**
 * @name ExpiryWrapper
 *
 * @description Sets a timer for a component before it disappears
 *
 * @param lengthInSeconds : number
 * @param children : ReactElement
 */
const ExpiryWrapper: FC<ComponentProps> = ({ lengthInSeconds, children }) => {
  // Decide whether we should render the component or not
  const [shouldRender, setShouldRender] = useState<boolean>(true);
  const expiryDate = lengthInSeconds * 1000;

  // Set the timeout for the expiry date
  useEffect(() => {
    // Set the timeout so we can hide our component
    setTimeout(() => {
      setShouldRender(false);
    }, expiryDate);
  }, [expiryDate]);

  // Determine which component we're going to render
  const componentToRender = shouldRender ? children : null;

  return componentToRender;
};

export default ExpiryWrapper;
