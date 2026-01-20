/**
 * @name useEditPostDetails
 *
 * @author Nothile Moyo
 *
 * @created 20/01/2026
 *
 * @description Moving the logic of the EditPost component into this hook, the logic is too complex for the component alone
 *
 */

import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { Post } from "../../../@types";

interface EditPostDetailsProps {
  post: Post | null;
}

const useEditPostDetails = () => {
  // Create context
  const context = useContext(AppContext);
  const [contentFetched, setContextFetched] = useState<boolean>(false);

  // 
  const [editPostDetails, setEditPostDetails] = useState<EditPostDetailsProps>({
    post: null,
  });
};
