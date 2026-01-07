/**
 * Date created: 28/02/2024
 *
 * Author: Nothile Moyo
 *
 * The error page component
 * This component renders a 404 page as a fallback if the route can't be handled
 */

import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASENAME } from "../../util/util";
import PageWrapper from "../../components/globals/PageWrapper";
import "./404.scss";

export const ErrorPage: FC = () => {
  // Instantiate the navigate object
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <section className="error">
        <h1>Error: 404 Page not found</h1>
        <p>
          Go to the <Link to={BASENAME}>home</Link> page
        </p>
        <p>
          Go{" "}
          <Link onClick={() => navigate(-1)} to="" data-testid="test-id-error-back-link">
            back
          </Link>{" "}
          to the previous page
        </p>
      </section>
    </PageWrapper>
  );
};
