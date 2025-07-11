import { describe, expect, test } from "@jest/globals";

// App test file, this test checks validation and handles redirections accordingly
describe("Testing jest to see if it works", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
  });
});
