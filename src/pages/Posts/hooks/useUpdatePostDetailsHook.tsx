/**
 * @name useEditPostDetails
 *
 * @author Nothile Moyo
 *
 * @created 26/01/2026
 *
 * @description Moving the logic of the EditPost component into this hook, the logic is too complex for the component alone
 * This handles the logic to validate the form and update the post data
 *
 */

import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import { Post } from "../../../@types";

type UpdatePostResult = {
  isUserValidated: boolean;
  post: Post | null;
  success: boolean;
  status: number;
};

interface UpdatePostDetailsProps {
  title: string;
  content: string;
  postId: string;
}

const useUpdatePostDetails = async ({ title, content, postId }: UpdatePostDetailsProps) => {
  // Create context
  const context = useContext(AppContext);

  // Setting the state
  const [contentFetched, setContextFetched] = useState<boolean>(false);
  const [updatePostResponse, setUpdatePostResponse] = useState<UpdatePostResult>({
    isUserValidated: true,
    post: null,
    success: false,
    status: 100,
  });

  const handleUpdatePostQuery = async ({}) => {
    // Perform the API request to the backend
    const editPostResponse = await fetch(`${context.baseUrl}/graphql/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                          mutation PostEditPostResponse(
                            $title : String!, 
                            $content : String!, 
                            $userId : String!, 
                            $fileData : FileInput, 
                            $postId : String!,
                            $carouselFileData: CarouselFileData
                          ){
                              PostEditPostResponse(
                                title : $title, 
                                content : $content, 
                                userId : $userId, 
                                fileData : $fileData, 
                                postId : $postId,
                                carouselFileData : $carouselFileData
                              ){
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
                                  status
                                  success
                                  message
                                  fileValidProps {
                                      fileName
                                      imageUrl
                                      isImageUrlValid
                                      isFileSizeValid
                                      isFileTypeValid
                                      isFileValid
                                  }
                                  isContentValid
                                  isTitleValid
                                  isPostCreator
                              }
                          }
                      `,
        variables: {
          title: title,
          content: content,
          userId: userId,
          fileData: fileData,
          carouselFileData: carouselImage ? carouselImage : null,
          postId: postId,
        },
      }),
    });

    // Get the result of the API request
    const data = await editPostResponse.json();
    const response = data.data.PostEditPostResponse;
  };

  // We do this here because we need the state in our context to update first before we execute the api requests
  useEffect(() => {
    context.validateAuthentication();
    setContextFetched(true);
  }, [context]);

  return updatePostResponse;
};

export default useUpdatePostDetails;
