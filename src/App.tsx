/**
 * Date created : 10/02/2024
 * Author : Nothile Moyo
 *
 * Description: Main app file, houses the dashboard and also handles validation for the user
 */

import { FC, useContext } from "react";
import { AppContext } from "./context/AppContext";
import LoadingSpinner from "./components/loader/LoadingSpinner";
import { BASENAME } from "./util/util";
import "./App.scss";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./components/modals/variants/ErrorModal";
import useUserDetails from "./hooks/useUserDetails";

const App: FC = () => {
  const navigate = useNavigate();
  // Pull isLoading from the hook but setting it to true for testing
  const { error, user, sessionCreated, sessionExpires } = useUserDetails();
  const isLoading = true;

  console.log("isLoading: ", isLoading);

  const appContextInstance = useContext(AppContext);

  if (!isLoading && !appContextInstance?.userAuthenticated) {
    navigate(`${BASENAME}/login`);
  }

  return (
    <div data-testid="test-id-app-component">
      {isLoading && <LoadingSpinner />}

      {!isLoading && error && <ErrorModal testId="test-id-error-modal" />}

      {!isLoading && appContextInstance?.userAuthenticated && user && !error && (
        <div className="app__content">
          <h1 className="app__title">{`Welcome ${user?.name}`}</h1>
          <p className="app__text">{`Current status : ${user?.status}`}</p>
          <p className="app__text">{`Email address : ${user?.email}`}</p>
          <p className="app__text">{`Session created : ${sessionCreated}`}</p>
          <p className="app__text">{`Session expires : ${sessionExpires}`}</p>
        </div>
      )}
    </div>
  );
};

export default App;
