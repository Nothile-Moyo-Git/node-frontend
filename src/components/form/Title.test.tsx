/**
 * Date created: 16/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the Title component
 * Tests basic functionality
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Title from "./Title";

describe("Textarea Component", () => {
  it("Matches the snapshot", async () => {
    renderWithoutRouting(<Title isFormValid>{"children"}</Title>, mockContext);
  });

  it("Renders false form", async () => {
    renderWithoutRouting(<Title isFormValid={false}>{"children"}</Title>, mockContext);
  });
});
