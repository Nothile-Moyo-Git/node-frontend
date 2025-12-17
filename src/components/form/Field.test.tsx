/**
 * Date created: 14/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the field component
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Field from "./Field";

describe("Field component", () => {
  it("Matches the snapshot", () => {
    const { baseElement } = renderWithoutRouting(
      <Field>
        <div>children</div>
      </Field>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Positions the field at the bottom", () => {
    const { baseElement } = renderWithoutRouting(
      <Field position="bottom">
        <div>children</div>
      </Field>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
