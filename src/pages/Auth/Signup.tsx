/**
 * Date created : 17/02/2024
 *
 * Author : Nothile Moyo
 *
 * Signup component, currently handles the signup page functionality
 */

import "./Signup.scss";

import { FC, useState, useContext, useEffect, useRef, FormEvent } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { BASENAME } from "../../util/util";

import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Field from "../../components/form/Field";
import Input from "../../components/form/Input";
import Label from "../../components/form/Label";
import Title from "../../components/form/Title";

export const SignupPage: FC = () => {
  // Instantiate the navigation object
  const navigate = useNavigate();

  // State values
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [emailErrortext, setEmailErrorText] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isConfirmPasswordValid, setIsconfirmPasswordValid] = useState<boolean>(true);
  const [doesUserExist, setDoesUserExist] = useState<boolean>(true);
  const [validateField, setValidateField] = useState<boolean>(false);

  // Check if the user is authenticated, if they are, then redirect to the previous page
  const appContextInstance = useContext(AppContext);

  // Submit handler
  const submitHandler = async (event: FormEvent) => {
    // Don't reload the page
    event.preventDefault();

    // Create values, we will overwrite them if they're set
    let emailAddress = "";
    let name = "";
    let password = "";
    let confirmPassword = "";

    // check if we have inputs and validate the form
    if (emailRef.current) {
      emailAddress = emailRef.current.value;
    }
    if (passwordRef.current) {
      password = passwordRef.current.value;
    }
    if (confirmPasswordRef.current) {
      confirmPassword = confirmPasswordRef.current.value;
    }
    if (nameRef.current) {
      name = nameRef.current.value;
    }

    // Perform the signup request to the backend
    try {
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
            email: emailAddress,
            password: password,
            confirmPassword: confirmPassword,
          },
        }),
      });

      const response = await result.json();

      console.log("\n\n");
      console.log("Response");
      console.log(response);

      const data = response.data.signupUserResponse;

      // Set our states and trigger a re-render so we can render errors if we have them
      setIsNameValid(data.isNameValid);
      setIsEmailValid(data.isEmailValid);
      setIsPasswordValid(data.isPasswordValid);
      setIsconfirmPasswordValid(data.doPasswordsMatch);
      setDoesUserExist(data.userExists);
      setValidateField(true);

      // Handle errors for the email address
      if (data.userExists === true) {
        setEmailErrorText("Error: User already exists with this email");
      }

      if (data.isEmailValid === false) {
        setEmailErrorText("Error: Email address isn't valid");
      }

      if (data.userExists === false && data.isEmailValid === true) {
        setEmailErrorText("");
        setValidateField(false);
      }

      if (!data.userExists && data.isNameValid && data.isEmailValid && data.isPasswordValid && data.doPasswordsMatch) {
        alert("Success");
        navigate(`${BASENAME}/login`);
      }
    } catch (error) {
      console.log("Request to /signup has failed");
      console.log(error);
    }
  };

  // Check authentication when component mounts
  useEffect(() => {
    appContextInstance?.validateAuthentication();

    // If the user is authenticated, redirect this route to the previous page
    if (appContextInstance?.userAuthenticated) {
      navigate(-1);
    }
  }, [appContextInstance, navigate]);

  return (
    <section className="signup">
      <Form onSubmit={submitHandler}>
        <Title>Signup</Title>

        <Field>
          <Label
            htmlFor="name"
            id="nameLabel"
            error={!isNameValid}
            errorText="Error: Name must be at least 6 characters"
            testId="test-id-signup-name-label"
          >
            Name*
          </Label>
          <Input
            ariaLabelledBy="nameLabel"
            error={!isNameValid}
            name="name"
            placeholder="Please enter your name"
            ref={nameRef}
            testId="test-id-signup-name-input"
            type="text"
            required={true}
          />
        </Field>

        <Field>
          <Label
            htmlFor="emailAddress"
            id="emailLabel"
            error={validateField && (!isEmailValid || !doesUserExist || (isEmailValid && doesUserExist))}
            errorText={emailErrortext}
            testId="test-id-signup-email-label"
          >
            Email*
          </Label>
          <Input
            ariaLabelledBy="emailLabel"
            error={validateField && (!isEmailValid || !doesUserExist || (isEmailValid && doesUserExist))}
            name="emailAddress"
            placeholder="Please enter your email"
            ref={emailRef}
            testId="test-id-signup-email-input"
            type="email"
            required={true}
          />
        </Field>

        <Field>
          <Label
            htmlFor="firstPassword"
            id="passwordLabel"
            error={!isPasswordValid}
            errorText="Error: Password must be between 6 and 20 characters and contain numeric digits"
            testId="test-id-signup-password-label"
          >
            Password*
          </Label>
          <Input
            ariaLabelledBy="firstPassword"
            error={!isPasswordValid}
            name="firstPassword"
            placeholder="Please enter your password"
            ref={passwordRef}
            testId="test-id-signup-password-input"
            type="password"
            required={true}
          />
        </Field>

        <Field>
          <Label
            htmlFor="confirmPassword"
            id="confirmPasswordLabel"
            error={!isConfirmPasswordValid}
            errorText="Error: Passwords don't match"
            testId="test-id-signup-password-confirm-label"
          >
            Confirm Password*
          </Label>
          <Input
            ariaLabelledBy="confirmPassword"
            error={!isConfirmPasswordValid}
            name="confirmPassword"
            placeholder="Please confirm your password"
            ref={confirmPasswordRef}
            testId="test-id-signup-password-confirm-input"
            type="password"
            required={true}
          />
        </Field>

        <Button variant="primary" testId="test-id-signup-button">
          Submit
        </Button>
      </Form>
    </section>
  );
};
