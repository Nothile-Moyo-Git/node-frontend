/**
 * Date created: 15/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Select for the field component
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import React from "react";
import { Select } from "./Select";
import { fireEvent, screen } from "@testing-library/react";

describe("Select Component", () => {
  it("Matches the snapshot", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const selectRef = React.createRef<HTMLSelectElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    const { baseElement } = renderWithoutRouting(
      <Select currentValue={1} variant="" id="test-id-select" ref={selectRef} name="name-select" />,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Matches the snapshot", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const selectRef = React.createRef<HTMLSelectElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    const { baseElement } = renderWithoutRouting(
      <Select
        currentValue={1}
        variant="pagination"
        options={["option-1", "option-2", "option-3"]}
        pages={[1, 2, 3]}
        id="test-id-select"
        labelledBy="test-input"
        ref={selectRef}
        name="name-select"
        required={true}
      />,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Has lebels and optional values", async () => {
    // Create a ref here for testing, we don't need to hook it up, just reference it
    const selectRef = React.createRef<HTMLSelectElement>();

    // Render without routing so that it doesn't default to the app component and there's no routing for pagination
    renderWithoutRouting(
      <Select
        currentValue={1}
        variant="pagination"
        pages={[1, 2, 3]}
        id="test-id-select"
        labelledBy="test-input"
        ref={selectRef}
        name="name-select"
        required={true}
      />,
      mockContext,
    );

    // Reference select element
    const select = screen.getByTestId("test-id-select") as HTMLSelectElement;

    // Reference the labelledBy attribute
    expect(select.getAttribute("aria-labelledby")).toBe("test-input");

    // Ensure options rendered (covers pages.map)
    expect(select.options.length).toBe(3);
    expect(select.options[0].value).toBe("1");
    expect(select.options[1].value).toBe("2");

    // Trigger updateValue
    fireEvent.change(select, {
      target: { value: "2" },
    });

    // State update reflected
    expect(select.value).toBe("2");
    expect(selectRef.current?.value).toBe("2");
  });

  it("Renders without aria-labelledby when labelledBy is not provided", () => {
    const selectRef = React.createRef<HTMLSelectElement>();

    renderWithoutRouting(
      <Select
        currentValue={1}
        variant="pagination"
        pages={[1, 2, 3]}
        id="test-id-select-no-label"
        ref={selectRef}
        name="name-select"
      />,
      mockContext,
    );

    const select = screen.getByTestId("test-id-select-no-label");

    // This exercises the FALSE branch of optional chaining
    expect(select.hasAttribute("aria-labelledby")).toBe(false);
  });
});
