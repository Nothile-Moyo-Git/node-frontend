/**
 *
 * Date created: 15/05/2024
 *
 * Author : Nothile Moyo
 *
 * Edit Post component
 * This component is a view screen uses the parameter to create a form with the fields already filled
 * This is a view screen which will take the postId in order to find the data required
 */

import React, { FC, FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./EditPost.scss";
import { FileData, Post } from "../../@types";
import { AppContext } from "../../context/AppContext";
import { BASENAME } from "../../util/util";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import ErrorModal from "../../components/modals/variants/ErrorModal";
import Form from "../../components/form/Form";
import Title from "../../components/form/Title";
import Field from "../../components/form/Field";
import Label from "../../components/form/Label";
import Input from "../../components/form/Input";
import Button from "../../components/button/Button";
import { fileUploadHandler, generateBase64FromImage } from "../../util/file";
import ImagePreview from "../../components/form/ImagePreview";
import TextArea from "../../components/form/TextArea";
import { MdKeyboardBackspace } from "react-icons/md";
import Carousel from "../../components/carousel/Carousel";
import useEditPostDetails from "./hooks/useEditPostDetails";

/**
 * @Name EditPost
 *
 * @Description The Edit Post Screen
 *
 * @Param postId ?: string
 *
 * @returns EditPost : JSX
 */
export const EditPost: FC = () => {
  // Get the parameters so extract the postId
  const params = useParams();
  const navigate = useNavigate();
  const postId = params.postId;
  const appContextInstance = useContext(AppContext);
  const location = useLocation();

  // State for the page
  const [postData, setPostData] = useState<Post>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showErrorText, setShowErrorText] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);
  const [isContentValid, setIsContentValid] = useState<boolean>(true);
  const [isFileValid, setIsFileValid] = useState<boolean>(true);
  const [isCarouselImageValid, setIsCarouselImageValid] = useState<boolean>(true);
  const [isPostCreatorValid, setIsPostCreatorValid] = useState<boolean>(true);
  const [uploadFile, setUploadFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<unknown | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>();
  const [previousImageUrl, setPreviousImageUrl] = useState<string>();
  const [carouselImage, setCarouselImage] = useState<FileData>();
  const [renderErrorModal, setRenderErrorModal] = useState<boolean>(false);

  // States and refs for our objects
  const titleRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Check which environment we're on for feature flag purposes
  const isDevelopment = process.env.NODE_ENV.trim() === "development";

  // Handle user authentication from the backend
  const { status, post } = useEditPostDetails({ userId: "", postId: postId ?? "" });

  // Validate the before submission so we can either render errors or perform the request
  const validateFields = () => {
    let title = "";
    let content = "";

    // Extract inputs
    if (titleRef.current) {
      title = titleRef.current.value;
    }
    if (contentRef.current) {
      content = contentRef.current.value;
    }

    let inputsValid = true;

    if (title.length < 3 || title.length > 100) {
      setIsFormValid(false);
      setIsTitleValid(false);
      inputsValid = false;
    } else {
      setIsTitleValid(true);
    }

    if (content.length < 6 || content.length > 600) {
      setIsFormValid(false);
      setIsContentValid(false);
      inputsValid = false;
    } else {
      setIsContentValid(true);
    }

    if (isDevelopment) {
      if (!uploadFile) {
        setIsFormValid(false);
        setIsFileValid(false);
        inputsValid = false;
      }
    }

    return inputsValid;
  };

  const getPostData = useCallback(
    async (userId: string) => {
      // Create the fields
      const fields = new FormData();
      fields.append("userId", userId);

      // Query to GraphQL
      const response = await fetch(`${appContextInstance.baseUrl}/graphql/posts`, {
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

      // Get the json from the backend
      const dataResponse = await response.json();

      // Get the data from the json
      const {
        data: { GetAndValidatePostResponse: data },
      } = dataResponse;

      // Show the error modal if the request fails
      if (data.status === 400) {
        setShowErrorText(true);
      }

      if (data.status === 500) {
        setRenderErrorModal(true);
      }

      return data;
    },
    [postId, appContextInstance.baseUrl],
  );

  // Set the preview of the file when the api request concludes so we can view it on the page immediately
  const formatPreviousPostImage = async (post: Post) => {
    try {
      // Only fetch the file if we have a filename
      if (post.fileName) {
        // Fetch the image, if it fails, reload the component
        setPreviousImageUrl(
          await require(
            `../../images${post.fileLastUpdated !== "" ? `/${post.fileLastUpdated}` : ""}/${post.fileName}`,
          ),
        );
      }
    } catch (error) {
      console.log("\n\n");
      console.log("Error loading image");
      console.log(error);
    }
  };

  // This method runs the get method and then formats the results
  const handlePostDataQuery = useCallback(
    async (userId: string) => {
      try {
        const data = await getPostData(userId);

        if (data.isUserValidated === false) {
          navigate(`${BASENAME}/posts`);
        }

        const success = data.success ? data.success : false;

        if (success === true) {
          setPostData(data.post);
          formatPreviousPostImage(data.post);
        }
      } catch (error) {
        console.log("handlePostDataQuery error");
        console.error(error);
      }
    },
    [getPostData, navigate],
  );

  // Back handler
  const backToPreviousPage = (event: React.MouseEvent) => {
    // Prevent form submission from button click
    event.preventDefault();

    // If we were on the domain, then go back to the previous page
    if (location.key !== "default") {
      navigate(-1);
    }
  };

  useEffect(() => {
    // Toggle the loading spinner until the request ends
    setIsLoading(true);
    appContextInstance.validateAuthentication();

    if (appContextInstance.userAuthenticated === true) {
      if (appContextInstance.token !== "") {
        handlePostDataQuery(appContextInstance.userId ? appContextInstance.userId : "");
      }
    }

    setIsLoading(false);

    // If the user isn't authenticated, redirect this route to the previous page
    if (!appContextInstance.userAuthenticated) {
      navigate(`${BASENAME}/login`);
    }
  }, [postId, appContextInstance, isPostCreatorValid, handlePostDataQuery, navigate]);

  // Update the post data, and return an error if required
  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (validateFields() === true) {
      try {
        // Get values
        const userId = appContextInstance.userId;
        const title = titleRef.current?.value || "";
        const content = contentRef.current?.value || "";

        let fileData = {};
        if (isDevelopment && uploadFile) {
          fileData = await fileUploadHandler(uploadFile, appContextInstance.baseUrl ? appContextInstance.baseUrl : "");
        }

        // Perform the API request to the backend
        const editPostResponse = await fetch(`${appContextInstance.baseUrl}/graphql/posts`, {
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

        const isFileValid =
          response.fileValidProps.isFileSizeValid &&
          response.fileValidProps.isFileTypeValid &&
          response.fileValidProps.isFileValid &&
          response.fileValidProps.isImageUrlValid;

        // Apply validation on the fields so we can show errors if needed
        if (uploadFile) {
          setIsFileValid(isFileValid);
        }
        setIsFormValid(response.success);
        setIsTitleValid(response.isTitleValid);
        setIsContentValid(response.isContentValid);
        setIsPostCreatorValid(response.isPostCreator);

        if (response.success === true) {
          // Reload the page if we were successful so we can query the updated results
          alert(`Success, Post ${postId} updated`);
          window.location.reload();
        }

        // Remove the image preview / file if it isn't valid so the user can upload a new one
        if (uploadFile && !isFileValid) {
          setUploadFile(undefined);
          setImagePreview(null);
          setShowImagePreview(false);
          if (imageUrlRef.current) {
            imageUrlRef.current.value = "";
          }
        }
      } catch (error) {
        console.log("Request failed");
        console.error(error);
      }
    }
  };

  // File upload handler, this is done so we can encode the file in a b64 format which allows us to send it to the backend
  const fileUploadChangeEvent = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the file so that it's ready for upload
    if (event.target.files) {
      const file = event.target.files[0];

      // Raise and error and empty the input, otherwise, set the state to sent to the backend
      // Note: This is for UX purposes, file uploads are also verified in the backend
      if (file.size > 5000000) {
        alert("Please upload a file smaller than 5MB");
        event.target.value = "";
      } else {
        setUploadFile(file);
        const base64Image = await generateBase64FromImage(file);
        setImagePreview(base64Image);
        setShowImagePreview(true);
      }
    }
  };

  const unauthorisedRequestSection = (
    <div>
      <p>Sorry, but you are not authorised to edit this post</p>
      {location.key !== "default" && (
        <Button type="button" variant="back" onClick={backToPreviousPage} testId="test-id-edit-post-back-button">
          <MdKeyboardBackspace />
          Go back
        </Button>
      )}
    </div>
  );

  return (
    <section className="editPost" data-testid="test-id-edit-post">
      {isLoading && <LoadingSpinner />}
      {!isLoading && showErrorText && unauthorisedRequestSection}
      {!isLoading && renderErrorModal && <ErrorModal testId="test-id-error-modal" />}
      {!isLoading && !showErrorText && !renderErrorModal && (
        <Form onSubmit={submitHandler} testId="test-id-edit-post-form">
          <Title isFormValid={isFormValid}>
            {isFormValid ? `Edit Post : ${postData?.title}` : "Error: Please fix the errors below"}
          </Title>

          {location.key !== "default" && (
            <Button type="button" variant="back" onClick={backToPreviousPage} testId="test-id-edit-post-back-button">
              <MdKeyboardBackspace />
              Go back
            </Button>
          )}

          <Field>
            <Label
              testId="test-id-edit-post-title-label"
              id="titleLabel"
              htmlFor="title"
              error={!isTitleValid}
              errorText={"Error: Title must be longer than 3 characters and less than 100"}
            >
              Title*
            </Label>
            <Input
              ariaLabelledBy="titleLabel"
              error={!isTitleValid}
              initialValue={postData?.title}
              name="title"
              placeholder="Enter your title here"
              ref={titleRef}
              required={true}
              type="string"
              testId="test-id-edit-post-title-input"
            />
          </Field>
          {isDevelopment ? (
            <Field>
              <Label
                testId="test-id-edit-post-file-upload-label"
                id="imageUrlLabel"
                htmlFor="imageUrl"
                error={!isFileValid}
                errorText="Error: Please upload a PNG, JPEG or JPG (max size: 5Mb)"
              >
                Image
              </Label>
              <Input
                ariaLabelledBy="imageUrlLabel"
                error={!isFileValid}
                name="image"
                onChange={fileUploadChangeEvent}
                ref={imageUrlRef}
                required={false}
                type="file"
                testId="test-id-edit-post-file-upload-input"
              />
            </Field>
          ) : (
            <Field>
              <Carousel
                setCarouselImage={setCarouselImage}
                isValid={isCarouselImageValid}
                setIsValid={setIsCarouselImageValid}
              />
            </Field>
          )}

          {(showImagePreview || previousImageUrl) && (
            <Field>
              {!showImagePreview && previousImageUrl && (
                <Label
                  testId="test-id-edit-post-preview-image-label"
                  id="imageUrlLabel"
                  htmlFor="imageUrl"
                  error={false}
                  errorText="Error: Please upload a PNG, JPEG or JPG (max size: 5Mb)"
                >{`Previous image: ${postData?.fileName}`}</Label>
              )}
              <ImagePreview
                encodedImage={showImagePreview ? imagePreview : previousImageUrl}
                imageSize="contain"
                imagePosition="left"
                testId="edit-post-image-preview"
              />
            </Field>
          )}

          <Field>
            <Label
              testId="test-id-edit-post-content-label"
              error={!isContentValid}
              htmlFor="content"
              id="contentLabel"
              errorText="Error: Content must be longer than 6 characters and less than 600 characters"
            >
              Content*
            </Label>
            <TextArea
              ariaLabelledBy="contentLabel"
              initialValue={postData?.content}
              error={!isContentValid}
              name="content"
              placeholder="Please enter your content"
              startingRows={3}
              ref={contentRef}
              required={true}
              testId="test-id-edit-post-content-input"
            />
          </Field>

          <Button variant="primary" testId="test-id-edit-post-submit-button">
            Submit
          </Button>
        </Form>
      )}
    </section>
  );
};
