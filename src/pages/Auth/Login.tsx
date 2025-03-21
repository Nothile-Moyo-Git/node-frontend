/**
 * Date created : 11/02/2024
 *
 * Author : Nothile Moyo
 *
 * Login component, this houses the login form which performs a login requests to the backend
 */

import "./Login.scss";

import { FC, useState, useEffect, useRef, FormEvent, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Form from "../../components/form/Form";
import Field from "../../components/form/Field";
import Label from "../../components/form/Label";
import Input from "../../components/form/Input";
import Button from "../../components/button/Button";
import Title from "../../components/form/Title";
import { useNavigate } from "react-router-dom";

export const LoginPage: FC = () => {
  // redirect using the navigate hook and not redirect
  const navigate = useNavigate();

  // Setting up the states
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [emailErrorText, setEmailErrorText] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [passwordErrorText, setPasswordErrorText] = useState<string>("");

  // Set up refs so we can reference our inputs. We use refs instead of state for performance optimizations
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Check if the user is authenticated, if they are, then redirect to the previous page
  const appContextInstance = useContext(AppContext);

  const submitHandler = async (event: FormEvent) => {
    // Don't reload the page
    event.preventDefault();

    // Get the values from the input
    let emailAddress = "";
    let password = "";

    if (emailRef.current) {
      emailAddress = emailRef.current.value;
    }
    if (passwordRef.current) {
      password = passwordRef.current.value;
    }

    // Perform the login request to the backend
    try {
      // Perform the signup request
      const result = await fetch(
        `${appContextInstance?.baseUrl}/graphql/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: `
                        mutation loginResponse($emailAddress : String!, $password : String!){
                            loginResponse(emailAddress : $emailAddress, password : $password){
                                userExists
                                success
                                emailValid
                                passwordValid
                                emailErrorText
                                passwordErrorText
                                token
                                userId
                            }
                        }
                    `,
            variables: {
              emailAddress: emailAddress,
              password: password,
            },
          }),
        },
      );

      // Get the data from the response
      const response = await result.json();

      const data = response.data.loginResponse;

      console.log("Data\n");
      console.log(data);

      // Set the states at the end of the request
      setIsEmailValid(data.emailValid);
      setEmailErrorText(data.emailErrorText);
      setIsPasswordValid(data.passwordValid);
      setPasswordErrorText(data.passwordErrorText);

      // Save our local storage results
      if (data.success === true) {
        const remainingTime = new Date();
        remainingTime.setDate(remainingTime.getDate() + 14);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("expiresIn", remainingTime.toISOString());

        // Redirect to the main page
        navigate("/");
      }
    } catch (error) {
      console.log("There was an error loading this page");
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
    <section className="login">
      <Form onSubmit={submitHandler}>
        <Title>Login</Title>

        <Field>
          <Label
            htmlFor="email"
            id="emailLabel"
            error={!isEmailValid}
            errorText={emailErrorText}
          >
            Email*
          </Label>
          <Input
            ariaLabelledBy="emailLabel"
            error={!isEmailValid}
            ref={emailRef}
            name="email"
            placeholder="Please enter your email address"
            type="text"
          />
        </Field>

        <Field>
          <Label
            htmlFor="password"
            id="passwordLabel"
            error={!isPasswordValid}
            errorText={passwordErrorText}
          >
            Password*
          </Label>
          <Input
            ariaLabelledBy="passwordLabel"
            error={!isPasswordValid}
            name="password"
            placeholder="Please enter your password"
            type="password"
            ref={passwordRef}
          />
        </Field>

        <Button variant="primary">Submit</Button>
      </Form>
    </section>
  );
};
