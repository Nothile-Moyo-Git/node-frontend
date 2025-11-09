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
import Sandbox from "../pages/Playground/Sandbox";

// General routes
const childRoutes = [
  {
    index: true,
    element: <App />,
  },
  {
    path: "livechat",
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
    path: "post/edit/:postId?",
    element: <EditPost />,
  },
  {
    path: "post/create",
    element: <CreatePostComponent />,
  },
];

// Protected routes (only on dev)
const protectedRoutes = [
  {
    path: "sandbox",
    element: <Sandbox />,
  },
];

// Generate the final route tree, we export it for tests
export const routes =
  process.env.NODE_ENV.trim() === "development"
    ? [...childRoutes, ...protectedRoutes]
    : [...childRoutes];

export const nestedRouter = createBrowserRouter([
  {
    path: BASENAME,
    element: <PageWrapper />,
    errorElement: <ErrorPage />,
    children: routes,
  },
]);
