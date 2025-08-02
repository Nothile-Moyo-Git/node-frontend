/**
 * Date created : 30/07/2025
 * Author : Nothile Moyo
 *
 * Test routing file, this will create routes which can be used in Jest for testing
 * We use this to be able to render our components
 *
 */
import { createMemoryRouter } from "react-router-dom";

// Component imports
import App from "../App";

export const RoutedAppComponent = createMemoryRouter([
  {
    path: "/",
    element: <App />,
  },
]);
