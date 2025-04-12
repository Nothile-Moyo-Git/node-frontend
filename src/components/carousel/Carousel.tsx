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
  }, []);

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

  return (
    <Carousel
      autoPlay={true}
      centerMode={true}
      infiniteLoop={true}
      interval={5000}
      useKeyboardArrows={true}
      showArrows={true}
      swipeable={true}
      swipeScrollTolerance={5}
      stopOnHover={true}
      emulateTouch={true}
      centerSlidePercentage={100}
    >
      {images.map((image, index) => (
        <div key={files[index].fileName}>
          <img alt={files[index].fileName} src={image} />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselWrapper;
