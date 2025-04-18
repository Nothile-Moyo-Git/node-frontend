/**
 * Date Created : 12/04/2025
 *
 * Author : Nothile Moyo
 *
 * PostCard component
 * Wraps an article in a card component in order to be rendered in a list
 */

import { FC, useContext, useEffect, useState } from "react";
import { FileData } from "../../@types";
import { Carousel } from "react-responsive-carousel";
import { AppContext } from "../../context/AppContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousel.scss";

const CarouselWrapper: FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const appContextInstance = useContext(AppContext);

  // Get a list of our files from the backend with an API request
  useEffect(() => {
    // Render images
    const generateImageSources = async () => {
      // Get a list of files
      const result = await fetch(
        `${appContextInstance?.baseUrl}/graphql/files`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: `
                            query GetFilePathsResponse{
                                GetFilePathsResponse{
                                    status
                                    files {
                                    fileName
                                    filePath
                                    }
                                }
                            }
                        `,
          }),
        },
      );

      if (result.status === 200) {
        const {
          data: {
            GetFilePathsResponse: { files },
          },
        } = await result.json();

        setFiles(files);
      }
    };

    generateImageSources();
  }, [appContextInstance]);

  // Generate our images so we can render them in the carousel, we do this here because we need the files state to be updated
  useEffect(() => {
    const retrieveImages = async () => {
      try {
        if (files.length > 0) {
          const renderableImages = await Promise.all(
            files.map(async (file: FileData) => {
              return await require(`../../images/${file.fileName}`);
            }),
          );

          setImages(renderableImages);
        }
      } catch (error) {
        console.log("Error assigning your files, please read below\n");
        console.log(error);
      }
    };

    retrieveImages();
  }, [files]);

  return images.length > 0 ? (
    <Carousel
      axis={"horizontal"}
      autoFocus={false}
      autoPlay={true}
      centerMode={true}
      centerSlidePercentage={100}
      dynamicHeight={false}
      emulateTouch={true}
      infiniteLoop={true}
      interval={5000}
      preventMovementUntilSwipeScrollTolerance={true}
      showArrows={true}
      showIndicators={true}
      showStatus={true}
      showThumbs={true}
      swipeable={true}
      swipeScrollTolerance={0}
      stopOnHover={true}
      transitionTime={500}
      useKeyboardArrows={true}
    >
      {images.map((image, index) => (
        <div key={files[index].fileName}>
          <img
            alt={files[index].fileName}
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
            src={image}
          />
          <p className="legend">{files[index].fileName}</p>
        </div>
      ))}
    </Carousel>
  ) : (
    <div></div>
  );
};

export default CarouselWrapper;
