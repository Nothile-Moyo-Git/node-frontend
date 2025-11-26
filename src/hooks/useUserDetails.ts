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

//
interface UserDetailsInterface {
  isLoading: boolean;
  error: boolean;
  user: User | null;
  sessionCreated: string;
  sessionExpires: string;
}

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

  useEffect(() => {
    const handleRequest = async () => {
      try {
        // Get our values from local storage
        context?.validateAuthentication();

        if (context?.userAuthenticated && context.userId) {
          const { user, success, sessionCreated, sessionExpires } = await getUserDetails();
        }
      } catch {
        
      } finally {
      }
    };
  }, [context]);
};
