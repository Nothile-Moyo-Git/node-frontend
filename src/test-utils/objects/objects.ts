import { User } from "../../@types";
import { ContextProps } from "../../context/AppContext";

const endpoint =
  process.env.NODE_ENV.trim() === "development"
    ? process.env.API_URL_DEV
    : process.env.API_URL_PROD;

// Define a user here which should have their details rendered on the main App page
export const mockUser: User = {
  _id: "6624158268f8cf47bea31396",
  name: "Nothile Moyo",
  email: "nothile1@gmail.com",
  password: "test",
  status: "active",
  posts: [
    "662423764e8c8b1633534be8",
    "662423884e8c8b1633534bf0",
    "662e7bcdd94fde36bf4bb554",
    "662e7c6ad94fde36bf4bb55c",
    "67843561d02db477bac4843b",
  ],
};

export const mockContext: ContextProps = {
  baseUrl: endpoint ? endpoint : "",
  checkAuthentication: () => true,
  logoutUser: () => {},
  token: "fake-token",
  userId: "123",
  userAuthenticated: true,
  validateAuthentication: () => {},
};
