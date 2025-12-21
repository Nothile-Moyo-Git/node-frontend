/**
 *
 * Date created: 21/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Tests to handle pagination functionality
 */

import userEvent from "@testing-library/user-event";
import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import { Paginator } from "./Paginator";
import { fireEvent, screen } from "@testing-library/react";

describe("Pagination component", () => {
  it("Matches the snapshot", () => {
    // Mock the functionality that our state update would execute
    const setPageMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback(3);
      }
    });
    // Mock the setState method so we can check if it has been called
    const { baseElement } = renderWithoutRouting(
      <Paginator numberOfPages={5} currentPage={3} setPage={setPageMock} />,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Changes the page", () => {
    // Mock the functionality that our state update would execute
    const setPageMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback(3);
      }
    });

    // Mock the setState method so we can check if it has been called
    renderWithoutRouting(<Paginator numberOfPages={5} currentPage={3} setPage={setPageMock} />, mockContext);

    // Increase the page
    const increasePageButton = screen.getByTestId("test-id-pagination-page-4");
    userEvent.click(increasePageButton);

    // Decreases the page
    const decreasePageButton = screen.getByTestId("test-id-pagination-page-2");
    userEvent.click(decreasePageButton);

    expect(setPageMock).toHaveBeenCalled();
  });

  it("Renders the default page", () => {
    // Mock the functionality that our state update would execute
    const setPageMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback(3);
      }
    });

    // Mock the setState method so we can check if it has been called
    const { baseElement } = renderWithoutRouting(<Paginator numberOfPages={8} setPage={setPageMock} />, mockContext);

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders the first page and then goes to the final page", () => {
    // Mock the functionality that our state update would execute
    const setPageMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback(3);
      }
    });

    // Mock the setState method so we can check if it has been called
    renderWithoutRouting(<Paginator numberOfPages={10} currentPage={5} setPage={setPageMock} />, mockContext);

    // Find page 1 and page 10 and render each of the pages
    const pageOneButton = screen.getByTestId("test-id-pagination-page-1");
    userEvent.click(pageOneButton);

    const pageTenButton = screen.getByTestId("test-id-pagination-page-10");
    userEvent.click(pageTenButton);

    expect(setPageMock).toHaveBeenCalled();
  });

  it("Selects a custom page from the dropdown", () => {
    // Mock the functionality that our state update would execute
    const setPageMock = jest.fn((callback) => {
      if (typeof callback === "function") {
        callback(3);
      }
    });

    // Mock the setState method so we can check if it has been called
    renderWithoutRouting(<Paginator numberOfPages={10} currentPage={5} setPage={setPageMock} />, mockContext);

    const select = screen.getByTestId("pagination-select-component") as HTMLSelectElement;

    // We know that the size of the options is equal to the number of pages
    // Since an array for the pages is made, we can infer our options this way
    // Rendering options yields HTMLOptionsCollection with no data unless you check the individual ones
    fireEvent.change(select, {
      target: { value: "4" },
    });

    const updatePageButton = screen.getByTestId("test-id-pagination-update-button");
    userEvent.click(updatePageButton);
  });
});
