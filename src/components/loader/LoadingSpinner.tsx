/**
 * Date Created: 16/03/2024
 * Author: Nothile Moyo
 *
 * A loading spinner to be rendered as a fallback whilst we're executing api requests
 *
 * This should be used in suspense components
 */

import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loadingWrapper">
      <span className="loadingSpinner"></span>
      <p className="loadingText">Loading, please wait...</p>
    </div>
  );
};

export default LoadingSpinner;
