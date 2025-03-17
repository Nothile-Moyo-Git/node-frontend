/**
 * Date created : 14/03/2024
 * Author : Nothile Moyo
 *
 * appContext file, this file loads will handle the global state management of the app.
 * This context is mostly for providing tokens and other security details to different components within the app
 *
 * This context will also be used to help determine which routes should be rendered on the front end
 * This context will also help to determine
 *
 * @returns AppContext : ReactContext
 */

import React, { useState, ReactNode } from "react";

// Typing for everything related to state management
interface ContextProps {
  token?: string;
  userId?: string;
  expiresIn?: string;
  userAuthenticated?: boolean;
  validateAuthentication: () => void;
  checkAuthentication: () => boolean;
  logoutUser: () => void;
}

interface ComponentProps {
  children?: ReactNode;
}

export const AppContext = React.createContext<ContextProps | null>(null);

const AppContextProvider = ({ children }: ComponentProps) => {
  // Set our token and expiration states
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [expiresIn, setExpiresIn] = useState<string>("");
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  // Check whether the user is authenticated and return a result
  // This avoids a bad state update whilst trying to render a component
  const checkAuthentication = () => {
    // Get local data
    const storageToken: string | null = localStorage.getItem("token");
    const storageUserId: string | null = localStorage.getItem("userId");
    const storageExpiresIn: string | null = localStorage.getItem("expiresIn");

    if (!storageExpiresIn || !storageToken || !storageUserId) {
      return false;
    } else {
      const currentDate = new Date();
      const expirationDate = new Date(storageExpiresIn);

      // Determine if the user is authenticated or not
      if (currentDate <= expirationDate) {
        return true;
      } else {
        return false;
      }
    }
  };

  // Update the state of the provider if
  const validateAuthentication = () => {
    // Get local data
    const storageToken: string | null = localStorage.getItem("token");
    const storageUserId: string | null = localStorage.getItem("userId");
    const storageExpiresIn: string | null = localStorage.getItem("expiresIn");

    // Set the values if we have them
    if (storageToken) {
      setToken(storageToken);
    }

    if (storageUserId) {
      setUserId(storageUserId);
    }

    if (storageExpiresIn) {
      setExpiresIn(storageExpiresIn);
    }

    // If we have a token stored locally and the expiry date hasn't passed, then authenticate the user
    if (storageExpiresIn !== null) {
      const currentDate = new Date();
      const expirationDate = new Date(storageExpiresIn);

      // Determine if the user is authenticated or not
      if (currentDate <= expirationDate) {
        setUserAuthenticated(true);
      } else {
        setUserAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiresIn");
      }
    }
  };

  // Log the user out intentionally
  const logoutUser = () => {
    // Remove all the items from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiresIn");

    // Reset our states
    setToken("");
    setUserId("");
    setExpiresIn("");
    setUserAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        token,
        userId,
        expiresIn,
        userAuthenticated,
        validateAuthentication,
        checkAuthentication,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
