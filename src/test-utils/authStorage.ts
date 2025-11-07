/**
 * Date Created: 05/08/2025
 *
 * Author: Nothile Moyo
 *
 * Description: This is the local storage handler file for my tests
 * It will handle anything that needs to be set in local storage, in this case, authentication
 *
 * All local storage items are deleted when the request is complete
 */

export const setMockAuthStorage = ({
  token = "mock-token",
  userId = "mock-user-id",
  expiresIn = new Date(Date.now() + 3600000).toISOString(),
} = {}) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("expiresIn", expiresIn);
};

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expiresIn");
};
