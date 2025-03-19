/**
 *
 * Date created: 07/05/2024
 *
 * Author: Nothile Moyo
 *
 * PostScreen component
 * This renders the details for a single Post on the screen
 *
 * @param postId ?: string
 */

import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "./PostScreen.scss";
import { Post } from "../../@types";
import { BASENAME, generateUploadDate } from "../../util/util";
import { MdKeyboardBackspace } from "react-icons/md";
import Button from "../../components/button/Button";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import ErrorModal from "../../components/modals/ErrorModal";

const PostScreen: FC = () => {
  const [isQuerying, setIsQuerying] = useState<boolean>(true);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [postData, setPostData] = useState<Post | null>(null);
  const [image, setImage] = useState<string>();

  const params = useParams();
  const postId = params.postId;

  // Instantiate values
  const appContextInstance = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get posts method, we define it here so we can call it asynchronously
    const getPostData = async () => {
      // Requesting the post from GraphQL using the postID, it's a post request
      const response = await fetch("/graphql/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
                        query GetPostResponse($postId : String!){
                            GetPostResponse(postId : $postId){
                                success
                                message
                                post {
                                    _id
                                    fileLastUpdated
                                    fileName
                                    title
                                    imageUrl
                                    content
                                    creator
                                    createdAt
                                    updatedAt
                                }
                            }
                        }
                    `,
          variables: {
            postId: postId ? postId : "",
          },
        }),
      });

      // Show the error if the request failed
      if (response.status === 200) {
        setShowErrorModal(false);
      } else {
        setShowErrorModal(true);
      }

      return response;
    };

    // Toggle the loading spinner util the request ends
    setIsQuerying(true);
    appContextInstance?.validateAuthentication();

    // Attempt to pull post data, returns an error if the request fails and renders the error modal
    try {
      if (appContextInstance?.userAuthenticated === true) {
        // Method defined here to allow async calls in a useEffect hook
        const fetchPostData = async () => {
          const result = await getPostData();

          const json = await result.json();

          const statusCode = result.status;

          if (statusCode === 200) {
            setPostData(json.data.GetPostResponse.post);
          }
        };

        if (appContextInstance?.token !== "") {
          fetchPostData();
          setIsQuerying(false);
        }
      }
    } catch (error) {
      console.error(error);
    }

    // If the user isn't authenticated, redirect this route to the previous page
    if (!appContextInstance?.userAuthenticated) {
      navigate(`${BASENAME}/login`);
    }
  }, [appContextInstance, postId, navigate]);

  useEffect(() => {
    const getImage = async () => {
      try {
        if (postData?.fileName && postData?.fileLastUpdated) {
          // Fetch the image, if it fails, reload the component
          setImage(
            await require(
              `../../uploads/${postData.fileLastUpdated}/${postData?.fileName}`,
            ),
          );
        }
      } catch (error) {
        console.log("Post screen image error");
        console.log(error);
      }
    };

    getImage();
  }, [postData]);

  console.log("\n\n");
  console.log("Test date");
  console.log(new Date(postData?.createdAt ? postData?.createdAt : ""));

  // Get an upload date so we can show when the post was uploaded
  const uploadDate = generateUploadDate(
    postData?.createdAt ? postData?.createdAt : "",
  );

  // Back handler
  const backToPreviousPage = () => {
    // If we were on the domain, then go back to the previous page
    if (location.key !== "default") {
      navigate(-1);
    }
  };

  return (
    <section className="post">
      {isQuerying && <LoadingSpinner />}

      {!isQuerying && !showErrorModal && (
        <>
          <h1 className="post__title">{postData?.title}</h1>
          {location.key !== "default" && (
            <Button variant="back" onClick={backToPreviousPage}>
              <MdKeyboardBackspace />
              Go back
            </Button>
          )}
          <p className="post__date">{`Uploaded: ${uploadDate}`}</p>
          <img src={image} alt={postData?.title} className="post__image" />
          <p>{postData?.content}</p>
        </>
      )}

      {!isQuerying && showErrorModal && <ErrorModal />}
    </section>
  );
};

export default PostScreen;
