/**
 *
 * Date created: 04/04/2024
 *
 * Author: Nothile Moyo
 *
 * License : MIT
 *
 * This is the image preview component
 * The component takes a b64 encoded image and renders it on the form
 */

import { FC } from "react";
import "./ImagePreview.scss";

interface ComponentProps {
  encodedImage: unknown | null;
  imageSize?: string;
  imagePosition?: string;
}

const ImagePreview: FC<ComponentProps> = ({ encodedImage, imageSize, imagePosition }) => {
  return (
    <div
      className="imagePreview"
      style={{
        backgroundImage: `url('${encodedImage}')`,
        backgroundSize: imageSize ? imageSize : "cover",
        backgroundPosition: imagePosition ? imagePosition : "center",
      }}
    />
  );
};

export default ImagePreview;
