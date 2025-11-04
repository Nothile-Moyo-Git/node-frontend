import { jest } from "@jest/globals";

export const mockWindowReload = () => {
  const reloadSpy = jest
    .spyOn(window.location, "reload")
    .mockImplementation(() => {});
  return reloadSpy;
};
