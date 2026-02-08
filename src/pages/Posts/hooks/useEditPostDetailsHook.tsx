/**
 * @name useEditPostDetails
 *
 * @author Nothile Moyo
 *
 * @created 20/01/2026
 *
 * @description Moving the logic of the EditPost component into this hook, the logic is too complex for the component alone
 *
 */

import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import { Post } from "../../../@types";

interface EditPostDetailsProps {
  userId: string;
  postId: string;
}

type EditPostDetails = {
  isLoading: boolean;
  isUserValidated: boolean;
  post: Post | null;
  status: number;
  success: boolean;
};

const useEditPostDetails = ({ userId, postId }: EditPostDetailsProps) => {
  // Create context
  const context = useContext(AppContext);

  // Setting the state
  const [contentFetched, setContextFetched] = useState<boolean>(false);
  const [editPostDetails, setEditPostDetails] = useState<EditPostDetails>({
    isLoading: true,
    isUserValidated: true,
    post: null,
    status: 100,
    success: false,
  });

  // We do this here because we need the state in our context to update first before we execute the api requests
  useEffect(() => {
    context.validateAuthentication();
    setContextFetched(true);
  }, [context]);

  const getPostData = useCallback(async () => {
    // Create the fields
    const fields = new FormData();
    fields.append("userId", userId);

    // Query to GraphQL
    const response = await fetch(`${context.baseUrl}/graphql/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                  query GetAndValidatePostResponse($postId : String!, $userId : String!){
                      GetAndValidatePostResponse(postId : $postId, userId : $userId){
                          success
                          message
                          post {
                              _id
                              fileLastUpdated
                              fileName
                              title
                              imageUrl
                              content
                              creator
                              createdAt
                              updatedAt
                          }
                          isUserValidated
                          status
                      }
                  }
              `,
        variables: {
          postId: postId,
          userId: userId,
        },
      }),
    });

    // Deconstruct the object, we use the status from here since a failed GraphQL doesn't return the status
    const responseInJSON = await response.json();
    const {
      data: { GetAndValidatePostResponse },
    } = responseInJSON;

    return GetAndValidatePostResponse;
  }, [userId, postId, context.baseUrl]);

  const handleRequest = useCallback(async () => {
    try {
      const { status, post, isUserValidated, success } = await getPostData();

      setEditPostDetails((previousState) => {
        return { ...previousState, status, post, isUserValidated, success };
      });
    } catch (error) {
      console.log("Error");
      console.error(error);
    } finally {
      setEditPostDetails((previousState) => {
        return { ...previousState, isLoading: false };
      });
    }
  }, [getPostData]);

  useEffect(() => {
    // Make sure we're validated first
    if (contentFetched === true) {
      handleRequest();
    }
  }, [contentFetched, handleRequest]);

  return editPostDetails;
};

export default useEditPostDetails;
