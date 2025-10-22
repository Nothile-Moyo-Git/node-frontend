/**
 *
 * Date created : 01/08/2024
 *
 * Author : Nothile Moyo
 *
 * Description: Sandbox, used for experimental functionality
 *
 */

import React, { FormEvent, useContext, useRef, useState } from "react";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Field from "../../components/form/Field";
import Label from "../../components/form/Label";
import Input from "../../components/form/Input";
import { generateBase64FromImage } from "../../util/file";
import ImagePreview from "../../components/form/ImagePreview";
import { AppContext } from "../../context/AppContext";
import ConfirmationModal from "../../components/modals/variants/ConfirmationModal";
/* import ConfirmationModal from "../../components/modals/variants/ConfirmationModal";
import ToastModal from "../../components/modals/variants/ToastModal"; */

const Sandbox = () => {
  // Dummy refs and states
  const [uploadFile, setUploadFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<unknown | null>();
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(true);

  // Check if the user is authenticated, if they are, then redirect to the previous page
  const appContextInstance = useContext(AppContext);

  const imageUrlRef = useRef<HTMLInputElement>(null);

  // File upload request, this one doesn't use GraphQL but will be used alongside a GraphQL request
  const dummyFileUploadHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const createDummyPostResolver = async (event: FormEvent) => {
    // Prevent the page from reloading
    event.preventDefault();

    // Setting the fields
    const fields = new FormData();
    if (uploadFile) {
      fields.append("image", uploadFile);
    }

    // Upload the file
    await fetch(`${appContextInstance?.baseUrl}/rest/post/file-upload`, {
      method: "POST",
      body: fields,
    });
  };

  // Signup request
  const signupResolver = async () => {
    // Calling the signup resolver which will take a validated input and then send a request to the backend
    const name = "Morrigan";
    const email = "hiyac78440@sgatra.com";
    const password = "3rdFisherman";
    const confirmPassword = "3rdFisherman";

    // Perform the signup request
    const result = await fetch(`${appContextInstance?.baseUrl}/graphql/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                    mutation signupUserResponse($name : String!, $email : String!, $password : String!, $confirmPassword : String!){
                        signupUserResponse(name : $name, email : $email, password : $password, confirmPassword : $confirmPassword){
                            isNameValid,
                            isEmailValid,
                            isPasswordValid,
                            doPasswordsMatch, 
                            userExists,
                            userCreated
                        }
                    }
                `,
        variables: {
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
      }),
    });

    const data = await result.json();
    console.log(data);
  };

  // Get user status request
  const getUserStatusResolver = async () => {
    // Calling the signup resolver which will take a validated input and then send a request to the backend
    const _id = "6656382efb54b1949e66bae2";

    // Perform the signup request
    const result = await fetch(`${appContextInstance?.baseUrl}/graphql/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                    query userStatusResponse($_id : String!){
                        userStatusResponse(_id : $_id){
                            user {
                                _id
                                name
                                status
                            },
                        }
                    }
                `,
        variables: {
          _id: _id,
        },
      }),
    });

    const data = await result.json();

    console.log("data");
    console.log(data);
  };

  // Any logic needed to test modals
  const toggleShowConfirmationModal = (id: string) => {
    console.log("Confirmatation modal: ", id);
    setShowConfirmationModal(false);
  };

  const deleteId = "delete-id-12345";

  return (
    <div>
      <br />

      <h1>This is the sandbox page, any functionality here is experimental</h1>

      <br />

      <Button
        variant="primary"
        onClick={signupResolver}
        testId="sandbox-create-user-button"
      >
        Create new user
      </Button>

      <br />

      <Button
        variant="primary"
        onClick={getUserStatusResolver}
        testId="sandbox-get-user-button"
      >
        Get user status
      </Button>

      <br />

      <Form onSubmit={createDummyPostResolver}>
        <Field>
          <Label
            htmlFor="imageUrl"
            id="imageUrlLabel"
            error={false}
            errorText="Error: Please upload a PNG, JPEG or JPG (max size: 5Mb)"
          >
            Image*
          </Label>
          <Input
            ariaLabelledBy="imageUrlLabel"
            error={false}
            name="image"
            onChange={dummyFileUploadHandler}
            ref={imageUrlRef}
            required={true}
            type="file"
          />
        </Field>

        {showImagePreview && (
          <Field>
            <ImagePreview
              encodedImage={imagePreview}
              imageSize="contain"
              imagePosition="left"
            />
          </Field>
        )}

        <Button variant="primary" testId="sandbox-create-post-button">
          Submit
        </Button>
      </Form>

      {/* showConfirmationModal && (
        <ConfirmationModal
          toggleConfirmationModal={toggleShowConfirmationModal}
          id={deleteId}
        />
      ) */}
      {/* <ToastModal variant="info" customMessage="This is the sandbox modal">
        <div>Toast Modal</div>
      </ToastModal> */}
      {
        <ConfirmationModal
          toggleConfirmationModal={toggleShowConfirmationModal}
          id={deleteId}
        />
      }
    </div>
  );
};

export default Sandbox;
