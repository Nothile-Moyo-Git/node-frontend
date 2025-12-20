/**
 * Date created: 20/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Tests for the error modal to ensure it renders properly
 */

import { renderWithoutRouting } from "../../../test-utils/testRouter";
import { mockContext } from "../../../test-utils/mocks/objects";
import ErrorModal from "./ErrorModal";

describe("Confirmation Modal Component", () => {
  it("Matches the snapshot", () => {
    // Render our component so we can see it
    const { baseElement } = renderWithoutRouting(<ErrorModal testId="test-id-error-modal" />, mockContext);

    expect(baseElement).toMatchSnapshot();
  });
});
