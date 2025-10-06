/**
 * Date created : 30/07/2025
 * Author : Nothile Moyo
 *
 * Test routing file, this will create routes which can be used in Jest for testing
 * We use this to be able to render our components
 *
 */
import { act, ReactNode } from "react";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AppContext, ContextProps } from "../context/AppContext";
import { routes } from "../routes/Router";

export function renderWithRouter(ui: ReactNode, { route = "/" } = {}) {
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
    future: {
      v7_relativeSplatPath: true,
    },
  });

  return render(
    <RouterProvider router={router} future={{ v7_startTransition: true }} />,
  );
}

export const renderWithContext = (
  ui: ReactNode,
  { route = "/" } = {},
  context: ContextProps,
) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
    future: {
      v7_relativeSplatPath: true,
    },
  });

  return render(
    <AppContext.Provider value={context}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AppContext.Provider>,
  );
};

// Render with act here so I don't constantly need to wrap it and save on duplication
export const renderWithAct = async (
  ui: ReactNode,
  { route = "/" } = {},
  context: ContextProps,
) => {
  await act(async () => {
    renderWithContext(ui, { route }, context);
  });
};
