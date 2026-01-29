/**
 * @name useEditPostDetails
 *
 * @author Nothile Moyo
 *
 * @created 26/01/2026
 *
 * @description Moving the logic of the EditPost component into this hook, the logic is too complex for the component alone
 * This handles the logic to validate the form and update the post data
 *
 */

import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import { Post } from "../../../@types";

type UpdatePostDetails = {
  isUserValidated: boolean;
  post: Post | null;
  success: boolean;
  status: number;
};

const useUpdatePostDetails = () => {
  // Create context
  const context = useContext(AppContext);

  // Setting the state
  const [contentFetched, setContextFetched] = useState<boolean>(false);
  const [updatePostDetails, setUpdatePostDetails] = useState<UpdatePostDetails>({
    isUserValidated: true,
    post: null,
    success: false,
    status: 100,
  });

  

  // We do this here because we need the state in our context to update first before we execute the api requests
  useEffect(() => {
    context.validateAuthentication();
    setContextFetched(true);
  }, [context]);

  return updatePostDetails;
};

export default useUpdatePostDetails;
