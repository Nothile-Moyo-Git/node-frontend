/**
 * Author: Nothile Moyo
 * Date created: 29/08/2025
 *
 * @description: This is the test file for the Post Screen component
 * We authenticate the user, and if valid, we then show a list of all posts on the page
 */

import "@testing-library/jest-dom";
import {
  clearAuthStorage,
  setMockAuthStorage,
} from "../../test-utils/authStorage";
import { server } from "../../test-utils/mockServer";

// Setup mocks and environment
beforeAll(() => {
  server.listen();
});

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  setMockAuthStorage();
});

// Cleanup mocks and environment
afterEach(() => {
  clearAuthStorage();
});

//
afterAll(() => {
  server.close();
});
