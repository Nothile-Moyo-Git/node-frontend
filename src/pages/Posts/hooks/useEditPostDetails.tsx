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

import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { Post } from "../../../@types";

interface EditPostDetailsProps {
  userId: string;
  postId: string;
}

type EditPostDetails = {
  post: Post | null;
};

const useEditPostDetails = ({ userId, postId }: EditPostDetailsProps) => {
  // Create context
  const context = useContext(AppContext);

  // Setting the state
  const [contentFetched, setContextFetched] = useState<boolean>(false);
  const [editPostDetails, setEditPostDetails] = useState<EditPostDetails>({
    post: null,
  });

  const getPostData = async () => {
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

    const responseInJSON = await response.json();
    const {
      data: { GetAndValidatePostResponse },
    } = responseInJSON;

    return GetAndValidatePostResponse;
  };

  const handleRequest = async () => {

  };
};
