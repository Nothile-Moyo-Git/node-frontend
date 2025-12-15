/**
 * Date created: 14/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: ImagePreview for the field component
 * These tests really arent necessary, they're just good for coverage
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import ImagePreview from "./ImagePreview";

describe("ImagePreview Component", () => {
  it("Matches the snapshot", async () => {
    const { baseElement } = renderWithoutRouting(
      <ImagePreview encodedImage={"image.png"} imageSize="contain" imagePosition="bottom" />,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders the default parameters", async () => {
    const { baseElement } = renderWithoutRouting(<ImagePreview encodedImage={"image.png"} />, mockContext);

    expect(baseElement).toMatchSnapshot();
  });
});
