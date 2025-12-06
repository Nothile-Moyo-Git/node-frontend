/**
 * Author: Nothile Moyo
 *
 * Date created: 05/12/2025
 *
 * Description: Testing for the PostCard, here we'll handle the image loading
 */

import { mockPost } from "../../test-utils/mocks/objects";
import { renderWithContext } from "../../test-utils/testRouter";
import { PostCard } from "./PostCard";
import { mockContext } from "../../test-utils/mocks/objects";

// Mock undici so we can fix the fastNowTimeout?.unref error
jest.mock("undici", () => ({
  fetch: jest.fn(),
}));

global.fetch = jest.fn();

describe("Post Card component", () => {
  it("Render the PostCard component", () => {
    const { baseElement } = renderWithContext(
      <PostCard post={mockPost} toggleConfirmationModal={jest.fn}></PostCard>,
      {},
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
