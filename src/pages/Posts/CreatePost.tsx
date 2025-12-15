/**
 *
 * Date created: 28/03/2024
 *
 * Author: Nothile Moyo
 *
 * Create post component, this component will house the form that will be used in order to create a new post
 * Only logged in users will be able to create posts in the backend
 */

import React, { FC, FormEvent, useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { BASENAME } from "../../util/util";
import Form from "../../components/form/Form";
import Title from "../../components/form/Title";
import Label from "../../components/form/Label";
import Input from "../../components/form/Input";
import Field from "../../components/form/Field";
import Button from "../../components/button/Button";
import TextArea from "../../components/form/TextArea";
import ImagePreview from "../../components/form/ImagePreview";
import { fileUploadHandler, generateBase64FromImage } from "../../util/file";

import "./CreatePost.scss";
import Carousel from "../../components/carousel/Carousel";
import { FileData } from "../../@types";

export const CreatePostComponent: FC = () => {
  // Check if the user is authenticated, if they are, then redirect to the previous page
  const appContextInstance = useContext(AppContext);

  const isDevelopment = process.env.NODE_ENV.trim() === "development";

  // Instantiate the navigation object
  const navigate = useNavigate();

  // States and refs for our objects
  const titleRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);
  const [isContentValid, setIsContentValid] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [isFileValid, setIsFileValid] = useState<boolean>(true);
  const [uploadFile, setUploadFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<unknown | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);

  // The carousel image data is for production, and we use it as an optional prop
  const [carouselImage, setCarouselImage] = useState<FileData>();

  // Check authentication when component mounts
  useEffect(() => {
    appContextInstance?.validateAuthentication();

    // If the user isn't authenticated, redirect this route to the previous page
    if (!appContextInstance?.userAuthenticated) {
      navigate(`${BASENAME}/login`);
    }
  }, [appContextInstance, navigate]);

  // Validate the before submission so we can either render errors or perform the request
  const validateFields = () => {
    const title = titleRef.current?.value || "";
    const content = contentRef.current?.value || "";

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

    return inputsValid;
  };

  // Handle the form submission for creating a new post
  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (validateFields() === true) {
      try {
        const userId = appContextInstance?.userId;

        let title = "";
        let content = "";

        // Extract inputs
        if (titleRef.current) {
          title = titleRef.current.value;
        }
        if (contentRef.current) {
          content = contentRef.current.value;
        }

        let fileData = {};

        if (isDevelopment) {
          if (uploadFile) {
            fileData = await fileUploadHandler(
              uploadFile,
              appContextInstance?.baseUrl ? appContextInstance?.baseUrl : "",
            );
          }
        }

        // Writing our mutations for both production and development, we choose based on the feature flag
        const createPostMutation = `
                      mutation PostCreatePostResponse(
                        $title: String!, 
                        $content: String!, 
                        $userId: String!, 
                        $fileData: FileInput,
                        $carouselFileData: CarouselFileData
                      ){
                          PostCreatePostResponse(
                            title: $title, 
                            content: $content, 
                            userId: $userId, 
                            fileData: $fileData,
                            carouselFileData: $carouselFileData
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
                              user
                              status
                              success
                              message
                              isContentValid
                              isTitleValid
                              isFileValid
                              isFileTypeValid
                              isFileSizeValid
                          }
                      }
                      `;

        // Perform the API request to the backend
        const createPostResponse = await fetch(`${appContextInstance?.baseUrl}/graphql/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: createPostMutation,
            variables: {
              title: title,
              content: content,
              userId: userId,
              fileData: fileData,
              carouselFileData: carouselImage ? carouselImage : null,
            },
          }),
        });

        // Extract the data from the stream
        const createPostData = await createPostResponse.json();

        // Get the GraphQL request response
        const data = createPostData.data.PostCreatePostResponse;

        // Set & handle validation on the front end
        setIsFormValid(data.success);
        setIsFileValid(data.isFileValid);
        setIsTitleValid(data.isTitleValid);
        setIsContentValid(data.isContentValid);

        if (data.success === true) {
          // Created form data
          const fields = new FormData();

          for (const property in data.post) {
            // Pass through non null or undefined values as FormData can only take strings or blobs
            if (data.post[property]) {
              fields.append(property, data.post[property]);
            }
          }

          // Trigger a modal which informs users that the post has been created
          await fetch("/rest/socket/emit/post-created", {
            method: "POST",
            body: fields,
          });

          alert("Post successfully submitted");
          window.location.href = `${BASENAME}/posts`;
        }
      } catch (error) {
        console.warn("Error");
        console.warn(error);
      }
    }
  };

  // File upload handler, this is done so we can encode the file in a b64 format which allows us to send it to the backend
  const fileUploadEvent = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <section className="createPost" data-testid="test-id-create-post">
      <Form onSubmit={submitHandler} testId="test-id-create-post-form">
        <Title isFormValid={isFormValid}>{isFormValid ? "Create Post" : "Error: Please fix the errors below"}</Title>
        <Field>
          <Label
            error={!isTitleValid}
            errorText="Error: Title must be longer than 3 characters and less than 100"
            htmlFor="title"
            id="titleLabel"
            testId="test-id-create-post-title-label"
          >
            Title*
          </Label>
          <Input
            ariaLabelledBy="titleLabel "
            error={!isTitleValid}
            name="title"
            placeholder="Please enter your title"
            ref={titleRef}
            required={true}
            testId="test-id-create-post-title-input"
            type="text"
          />
        </Field>

        {isDevelopment ? (
          <Field>
            <Label
              htmlFor="imageUrl"
              id="imageUrlLabel"
              error={!isFileValid}
              errorText="Error: Please upload a PNG, JPEG or JPG (max size: 5Mb)"
              testId="test-id-create-post-image-label"
            >
              Image*
            </Label>
            <Input
              ariaLabelledBy="imageUrlLabel"
              error={!isFileValid}
              name="image"
              onChange={fileUploadEvent}
              ref={imageUrlRef}
              required={true}
              testId="test-id-create-post-file-upload-input"
              type="file"
            />
          </Field>
        ) : (
          <Field>
            <Carousel setCarouselImage={setCarouselImage} />
          </Field>
        )}

        {showImagePreview && (
          <Field>
            <ImagePreview encodedImage={imagePreview} imageSize="contain" imagePosition="left" />
          </Field>
        )}

        <Field>
          <Label
            error={!isContentValid}
            htmlFor="content"
            id="contentLabel"
            errorText="Error: Content must be longer than 6 characters and less than 600 characters"
            testId="test-id-create-post-content-label"
          >
            Content*
          </Label>
          <TextArea
            ariaLabelledBy="contentLabel"
            error={!isContentValid}
            name="content"
            placeholder="Please enter your content"
            startingRows={3}
            ref={contentRef}
            required={true}
            testId="test-id-create-post-content-input"
          />
        </Field>

        <Button variant="primary" testId="test-id-create-post-button">
          Submit
        </Button>
      </Form>
    </section>
  );
};
