/**
 * Author: Nothile Moyo
 *
 * Date created: 05/12/2025
 *
 * Description: Testing for the PostCard, here we'll handle the image loading
 */

import { screen } from "@testing-library/react";
import { mockPost, mockPostWithoutOptionals } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import { PostCard } from "./PostCard";
import { mockContext } from "../../test-utils/mocks/objects";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock undici so we can fix the fastNowTimeout?.unref error
jest.mock("undici", () => ({
  fetch: jest.fn(),
}));

global.fetch = jest.fn();

describe("Post Card component", () => {
  it("Render the PostCard component", async () => {
    const { baseElement } = renderWithoutRouting(
      <PostCard post={mockPost} toggleConfirmationModal={jest.fn}>
        <div>PostCard</div>
      </PostCard>,
      mockContext,
    );

    // Make sure our image render from the require
    // This is handled in src\test-utils\mocks\fileMock.js
    // The setup is found here jest.config.js
    await waitFor(() => expect(screen.getByTestId("test-id-postcard-image")).toBeVisible());

    expect(baseElement).toMatchSnapshot();
  });

  it("Render the PostCard component without optional values", async () => {
    const { baseElement } = renderWithoutRouting(
      <PostCard post={mockPostWithoutOptionals} toggleConfirmationModal={jest.fn}>
        <div>PostCard</div>
      </PostCard>,
      mockContext,
    );

    // Here we click on the toggleConfirmationModal button
    await waitFor(() => {
      const image = screen.getByTestId("test-id-postcard-image");
      expect(image).toBeVisible();
    });

    const deleteButton = screen.getByTestId(`test-id-delete-${mockPostWithoutOptionals._id}`);
    userEvent.click(deleteButton);

    expect(baseElement).toMatchSnapshot();
  });
});
