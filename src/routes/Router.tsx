/**
 *
 * Date created: 12/02/2024
 *
 * Author : Nothile Moyo
 *
 * This file handles the routing for the application
 * Note: when using the basename, in your local server, navigate to the URL
 */

import { ErrorPage } from "../pages/Error/404";
import { LoginPage } from "../pages/Auth/Login";
import { SignupPage } from "../pages/Auth/Signup";
import { CreatePostComponent } from "../pages/Posts/CreatePost";
import PageWrapper from "../components/globals/PageWrapper";
import { BASENAME } from "../util/util";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import { ViewPosts } from "../pages/Posts/ViewPosts";
import PostScreen from "../pages/Posts/PostScreen";
import { EditPost } from "../pages/Posts/EditPost";
import LiveChat from "../pages/Sockets/LiveChat";
import GraphQLInterface from "../pages/GraphQL/GraphQLInterface";

export const nestedRouter = createBrowserRouter([
  {
    path: BASENAME,
    element: <PageWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "chat",
        element: <LiveChat />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "posts/:page?",
        element: <ViewPosts />,
      },
      {
        path: "post/:postId?",
        element: <PostScreen />,
      },
      {
        path: "edit-post/:postId?",
        element: <EditPost />,
      },
      {
        path: "graphql",
        element: <GraphQLInterface />,
      },
      {
        path: "post/create",
        element: <CreatePostComponent />,
      },
    ],
  },
]);
