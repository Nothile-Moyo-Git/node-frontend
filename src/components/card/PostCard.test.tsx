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
import { Post } from "../../@types";

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

  it("Try to render an image without a fileName so we skip the import", async () => {
    const mockPostNoImage: Post = {
      ...mockPost,
      fileName: "",
    };

    const { baseElement } = renderWithoutRouting(
      <PostCard post={mockPostNoImage} toggleConfirmationModal={jest.fn}>
        <div>PostCard</div>
      </PostCard>,
      mockContext,
    );

    // Here we click on the toggleConfirmationModal button
    await waitFor(() => {
      expect(baseElement).toMatchSnapshot();
    });
  });

  it("Triggers the error in the catch block for the image", async () => {
    const mockPostNoImage: Post = {
      ...mockPost,
      fileName: "broken.png",
      fileLastUpdated: "",
    };

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const { baseElement } = renderWithoutRouting(
      <PostCard post={mockPostNoImage} toggleConfirmationModal={jest.fn}>
        <div>PostCard</div>
      </PostCard>,
      mockContext,
    );

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Could not extract image");
      expect(logSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
    logSpy.mockRestore();

    expect(baseElement).toMatchSnapshot();
  });
});
