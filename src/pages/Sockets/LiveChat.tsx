/**
 *
 * Date created : 04/06/2024
 *
 * Author : Nothile Moyo
 *
 * Live chat component, shows the current live chat being active by use of socket IO
 * This will apply to both the front and the backend
 */
import "./LiveChat.scss";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  FC,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import Form from "../../components/form/Form";
import Field from "../../components/form/Field";
import Button from "../../components/button/Button";
import { AppContext } from "../../context/AppContext";
import { User } from "../../@types";
import { useNavigate } from "react-router-dom";
import { BASENAME } from "../../util/util";
import TextArea from "../../components/form/TextArea";

interface chatMessage {
  message: string;
  dateSent: string;
  senderId: string;
  sender: string;
}

const LiveChat: FC = () => {
  const navigate = useNavigate();
  const appContextInstance = useContext(AppContext);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [chatMessages, setChatMessages] = useState<chatMessage[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [chatStyles, setChatStyles] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<User>();
  const socketClientRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();

  // Get the endpoint
  const liveChatEndpoint =
    process.env.NODE_ENV.trim() === "development"
      ? process.env.REACT_APP_API_DEV
      : process.env.REACT_APP_API_PROD;

  // Get the correct port based on the environment
  const port =
    process.env.NODE_ENV.trim() === "development"
      ? process.env.REACT_APP_API_DEV_PORT
      : process.env.REACT_APP_API_PROD_PORT;

  // Connect to our backend using our websocket using the correct port so it works on both dev and production
  useEffect(() => {
    const client = io(String(liveChatEndpoint), { port: port });

    console.log("Connection");
    console.log(client);

    // Add a message to the chat
    client.on("message sent", (message) => {
      setChatMessages((previousMessages) => {
        return [...previousMessages, message];
      });
    });

    // Set this to a ref so we can keep the value between re-renders
    if (!socketClientRef.current) {
      socketClientRef.current = client;
    }

    return () => {
      // Remove unncessary event handlers
      client.removeAllListeners();
    };
  }, [liveChatEndpoint, port]);

  // Determine if the current user is the sender or recipient
  const isSender = (currentUser: string, messageSender: string) => {
    return currentUser === messageSender;
  };

  // Get user details if the user is authenticated from the backend
  const getUserDetails = useCallback(
    async (userId: string) => {
      const response = await fetch(
        `${appContextInstance?.baseUrl}/graphql/auth`,
        {
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
                    }
                }`,
            variables: {
              _id: userId,
              token: appContextInstance?.token ?? "",
            },
          }),
        },
      );

      // Get the result from the endpoint
      const {
        data: { PostUserDetailsResponse: user },
      } = await response.json();

      // Set the user details so
      setUserDetails(user.user);
    },
    [appContextInstance],
  );

  // Get the chat messages async since we can't do it in our useEffect hook
  const getChatMessages = useCallback(
    async (userId: string, recipientId: string) => {
      // Perform the signup request
      const response = await fetch(
        `${appContextInstance?.baseUrl}/graphql/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: `
                    query chatMessagesResponse($_id : String!, $recipientId : String){
                        chatMessagesResponse(_id : $_id, recipientId : $recipientId){
                            success
                            messages {
                                userIds
                                messages {
                                    _id
                                    dateSent
                                    message
                                    sender
                                    senderId
                                }
                            }
                            error
                        }
                    }
                `,
            variables: {
              _id: userId,
              recipientId: recipientId,
            },
          }),
        },
      );

      const {
        data: {
          chatMessagesResponse: { success, messages },
        },
      } = await response.json();

      // Generate the styles for the chat so that they go either way
      const generateChatStyles = () => {
        // Iterate through the messages and set the styling based on the user
        const generatedStyles = messages.messages.map(
          (message: chatMessage) => {
            if (message.senderId === userIds[1]) {
              return "liveChat__content--align-right";
            }

            return "liveChat__content--align-left";
          },
        );

        setChatStyles(generatedStyles);
      };

      // Set the messages from the backend if we have them
      if (messages.length !== 0 && success) {
        // Here we set it to the messages object in messages since we have properties like userId etc...
        setUserIds(messages.userIds);
        setChatMessages(messages.messages);
        generateChatStyles();
      }
    },
    [appContextInstance, userIds],
  );
  // Get the user details from the backend for the chat
  useEffect(() => {
    appContextInstance?.validateAuthentication();

    try {
      // Get the user information so we can share it in the post
      if (appContextInstance?.userId) {
        getUserDetails(appContextInstance.userId);
      }

      const recipientId = "6656382efb54b1949e66bae2";

      if (appContextInstance?.userId) {
        getChatMessages(appContextInstance.userId, recipientId);
      }
    } catch (error) {
      console.error(error);
    }

    // If the user isn't authenticated, redirect this route to the previous page
    if (!appContextInstance?.userAuthenticated) {
      navigate(`${BASENAME}/login`);
    }
  }, [appContextInstance, getChatMessages, getUserDetails, navigate]);

  // Submit handler, this allows messages to be sent between clients
  const onSubmit = async (event: FormEvent) => {
    // Stop the page from reloading
    event.preventDefault();

    // If we have an input, send a message to the socket
    if (contentRef.current) {
      // We assign Formdata here so we can use this with cors in the backend
      const userId = appContextInstance?.userId
        ? appContextInstance.userId
        : "";
      const recipientId = "6656382efb54b1949e66bae2";

      // Add the message and sender to a JSON object so that we can we return the sender
      const chatMessage = contentRef.current.value;
      const sender = userDetails ? userDetails.name : "";
      const json = JSON.stringify({
        message: chatMessage,
        sender: sender,
        senderId: userId,
      });

      // Send the message to the websocket
      if (socketClientRef.current) {
        socketClientRef.current.emit("chat message", json);
      }

      // Set the fields on the form
      const fields = new FormData();
      fields.append("senderId", userId);
      fields.append("sender", userDetails ? userDetails.name : "");
      fields.append("recipientId", recipientId);
      fields.append("messages", JSON.stringify(chatMessages));
      fields.append("newMessage", contentRef.current.value);

      await fetch(
        `${appContextInstance?.baseUrl}/chat/send-message/${userId}`,
        {
          method: "POST",
          body: fields,
        },
      );
      // Reset our input after we've posted a new message to the chat and backend
      contentRef.current.value = "";
    }
  };

  return (
    <section className="liveChat">
      <h1 className="liveChat__title">Live Chat</h1>

      {chatMessages.map((message: chatMessage, index: number) => {
        return (
          <div className="liveChat__message" key={`message-${index}`}>
            {(index === 0 ||
              (index > 0 &&
                chatMessages[index].senderId !==
                  chatMessages[index - 1].senderId)) && (
              <p
                className={`liveChat__description ${!isSender(userDetails?._id ?? "", message.senderId) && "liveChat__description--align-right"}`}
              >
                <span className="liveChat__icon">{message.sender[0]}</span>
                <span>{message.sender}</span>
                <span className="liveChat__date">{` ${message.dateSent}`}</span>
              </p>
            )}

            <p className={`liveChat__content ${chatStyles[index]}`}>
              {message.message}
            </p>
          </div>
        );
      })}
      <Form size="full" onSubmit={onSubmit}>
        <Field position="bottom">
          <TextArea
            ariaLabelledBy="contentLabel"
            error={false}
            name="content"
            placeholder="Please post your message in the chat"
            square={true}
            startingRows={3}
            ref={contentRef}
            required={true}
          />
          <Button variant="square">Send</Button>
        </Field>
      </Form>
    </section>
  );
};

export default LiveChat;
