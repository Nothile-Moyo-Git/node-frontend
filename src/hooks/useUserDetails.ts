/**
 * Author: Nothile Moyo
 *
 * Date created: 26/11/2025
 *
 * Description: This file is a hook to handle getting current user details, it's placed here
 * as a separation of concerns as the component logic gets too complex in this app
 */

import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User } from "../@types";
import { checkSessionValidation } from "../util/util";

//
interface UserDetailsInterface {
  isLoading: boolean;
  error: boolean;
  user: User | null;
  sessionCreated: string;
  sessionExpires: string;
}

/**
 * @name useUserDetails
 *
 * @description Hook which handles getting the user details from the backend. Returns an error in state if false
 *
 * @types UserDetailsInterface:
 * isLoading: boolean
 * error: boolean
 * user: User
 * sessionCreated: string
 * sessionExpires: string
 *
 * @params none
 * @returns userDetails : UserDetailsInterface
 *
 */
const useUserDetails = () => {
  // Get our context from the backend for our session details we get from local storage
  const context = useContext(AppContext);

  // State management for the userDetails hook
  const [userDetails, setUserDetails] = useState<UserDetailsInterface>({
    isLoading: true,
    error: false,
    user: null,
    sessionCreated: "",
    sessionExpires: "",
  });

  useEffect(() => {
    // Get user details if the user is authenticated from the backend
    const getUserDetails = async () => {
      // Perform the fetch request using GraphQL in order to get the user details on the main app page
      // Note: Please convert your id to an objectId in the backend
      const response = await fetch(`${context?.baseUrl}/graphql/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            query PostUserDetailsResponse($_id : String!, $token : String!){
              PostUserDetailsResponse(_id : $_id, token : $token){
                user {
                  _id
                  name
                  email
                  password
                  confirmPassword
                  status
                  posts
                }
                sessionCreated
                sessionExpires
                success
                }
              }
            `,
          variables: {
            _id: context?.userId ?? "",
            token: context?.token ?? "",
          },
        }),
      });

      // Handle the response
      const { data } = await response.json();
      return data.PostUserDetailsResponse;
    };
    const handleRequest = async () => {
      try {
        // Get our values from local storage
        context?.validateAuthentication();

        // Get the details from the backend
        if (context?.userAuthenticated && context.userId) {
          const { user, success, sessionCreated, sessionExpires } = await getUserDetails();

          if (!success) {
            setUserDetails((previousState) => {
              return { ...previousState, error: true };
            });
            return;
          }

          setUserDetails((previousState) => {
            return { ...previousState, user, sessionCreated, sessionExpires };
          });

          if (context?.userAuthenticated && context.userId && context.token) {
            await checkSessionValidation(context.userId, context.token, context.baseUrl);
          }
        }
      } catch {
        setUserDetails((previousState) => {
          return { ...previousState, error: true };
        });
      } finally {
        setTimeout(() => {
          setUserDetails((previousState) => {
            return { ...previousState, isLoading: false };
          });
        }, 3000);
      }
    };

    handleRequest();
  }, [context]);

  return userDetails;
};

export default useUserDetails;
