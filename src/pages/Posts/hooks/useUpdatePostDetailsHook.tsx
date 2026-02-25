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

import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { FileData, FileRequestData, Post } from "../../../@types";
import { mockFileProps } from "../../../test-utils/mocks/objects";

interface UpdatePostDetailsProps {
  postId: string;
}

type UpdatePostResponseProps = {
  post: Post | null;
  status: number;
  success: boolean;
  message: string;
  fileValidProps: FileRequestData;
  isContentValid: boolean;
  isTitleValid: boolean;
  isPostCreator: boolean;
};

type updatePostQueryProps = {
  fileData: FileRequestData;
  userId: string;
  carouselImage: FileData | null;
  title: string;
  content: string;
};

const useUpdatePostDetails = ({ postId }: UpdatePostDetailsProps) => {
  // Create context
  const context = useContext(AppContext);

  // Store our hook data that we can return here
  const [updatePostDetails, setUpdatePostDetails] = useState<UpdatePostResponseProps>({
    post: null,
    status: 100,
    success: false,
    message: "Update pending",
    fileValidProps: mockFileProps,
    isContentValid: true,
    isTitleValid: true,
    isPostCreator: true,
  });

  // Setting the state
  const handleUpdatePostQuery = async ({ fileData, userId, carouselImage, title, content }: updatePostQueryProps) => {
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
          carouselFileData: carouselImage,
          postId: postId,
        },
      }),
    });

    // Get the result of the API request
    const data = await editPostResponse.json();
    const response = data.data.PostEditPostResponse;
    setUpdatePostDetails(response);
    return response;
  };

  return {
    updatePostDetails,
    handleUpdatePostQuery,
  };
};

export default useUpdatePostDetails;
