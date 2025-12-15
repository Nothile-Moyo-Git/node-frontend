/**
 * Date created: 14/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Test for the form component
 */

import { mockContext } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Form from "./Form";
import { screen } from "@testing-library/react";

describe("Form component", () => {
  it("Matches the snapshot", () => {
    const { baseElement } = renderWithoutRouting(
      <Form onSubmit={jest.fn()} testId="test-id-test-form">
        <div>children</div>
      </Form>,
      mockContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders full size form", () => {
    renderWithoutRouting(
      <Form onSubmit={jest.fn()} size="full" isFormValid={true} testId="test-id-test-form">
        <div>children</div>
      </Form>,
      mockContext,
    );

    const form = screen.getByTestId("test-id-test-form");

    expect(form).toBeVisible();
  });

  it("Renders default form", () => {
    renderWithoutRouting(
      <Form onSubmit={jest.fn()} isFormValid={true} testId="test-id-test-form">
        <div>children</div>
      </Form>,
      mockContext,
    );

    const form = screen.getByTestId("test-id-test-form");

    expect(form).toBeVisible();
  });

  it("Shows error styling", () => {
    renderWithoutRouting(
      <Form onSubmit={jest.fn()} isFormValid={false} testId="test-id-test-form">
        <div>children</div>
      </Form>,
      mockContext,
    );

    const form = screen.getByTestId("test-id-test-form");

    expect(form).toBeVisible();
  });
});
