/**
 * Date Created : 20/04/2024
 *
 * Author : Nothile Moyo
 *
 * PostCard component
 * Wraps an article in a card component in order to be rendered in a list
 */

import "./PostCard.scss";
import "../button/Button.scss";
import { Post } from "../../@types";
import { FC, ReactNode, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASENAME, generateUploadDate } from "../../util/util";
import Button from "../button/Button";
import { AppContext } from "../../context/AppContext";

interface ComponentProps {
  children?: ReactNode;
  post: Post;
  toggleConfirmationModal: (_id: string) => void;
}

export const PostCard: FC<ComponentProps> = ({
  post,
  toggleConfirmationModal,
}) => {
  const [image, setImage] = useState<string>();

  // We use this state in order to determine whether we shoud show the edit and delete buttons or not
  const [isPostCreator, setIsPostCreator] = useState<boolean>();

  // Get the app context so we can get the userId for comparison
  const appContextInstance = useContext(AppContext);

  // Check if we're the same user here
  useEffect(() => {
    setIsPostCreator(appContextInstance?.userId === post.creator);
  }, [appContextInstance, post.creator]);

  useEffect(() => {
    const getImage = async () => {
      try {
        // Only fetch the file if we have a filename
        if (post?.fileName && post?.fileLastUpdated) {
          // Fetch the image, if it fails, reload the component
          setImage(
            await require(
              `../../uploads/${post?.fileLastUpdated}/${post?.fileName}`,
            ),
          );
        }
      } catch (error) {
        console.log("Could not extract image");
        console.log(error);
      }
    };

    getImage();
  }, [post]);

  // Get an upload date so we can show when the post was uploaded
  const uploadDate = generateUploadDate(
    post?.createdAt ? Number(post?.createdAt) : "",
  );

  return (
    <article className="article">
      <img
        src={image}
        alt={post?.title}
        className="article__image"
        draggable={false}
      />

      <div className="article__content">
        <h2 className="article__title">{post?.title}</h2>
        <p className="article__description">{post?.content}</p>
        <p>{`Uploaded: ${uploadDate}`}</p>
        <div className="article__buttons">
          <Link
            to={`${BASENAME}/post/${post?._id}`}
            className="link__read-more"
          >
            Read more
          </Link>

          {isPostCreator && (
            <Link
              to={`${BASENAME}/edit-post/${post?._id}`}
              className="link__edit"
            >
              Edit
            </Link>
          )}

          {isPostCreator && (
            <Button
              variant="delete"
              onClick={() => toggleConfirmationModal(post._id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};
