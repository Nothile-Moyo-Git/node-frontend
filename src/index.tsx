import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { nestedRouter } from "./routes/Router";
import { RouterProvider } from "react-router-dom";
import AppContextProvider from "./context/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={nestedRouter} />
    </AppContextProvider>
  </React.StrictMode>,
);
