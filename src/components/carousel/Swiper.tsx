/**
 * Date Created : 12/04/2025
 *
 * Author : Nothile Moyo
 *
 * PostCard component
 * Wraps an article in a card component in order to be rendered in a list
 */

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { FC, useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { FileData } from "../../@types";
import LoadingSpinner from "../loader/LoadingSpinner";

// Default swiper styles
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";

// My styles, these override the swiper styles since they're defined later
// Make sure that these are scoped more than the default styling if the override doesn't work
import "./Swiper.scss";

const Carousel: FC = () => {
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
    <Swiper
      autoplay={{
        delay: 5000,
        pauseOnMouseEnter: true,
      }}
      centeredSlides={true}
      modules={[Pagination, Navigation, Autoplay]}
      navigation={true}
      slidesPerView={1}
    >
      {images.map((image, index) => (
        <SwiperSlide key={files[index].fileName}>
          <img alt={files[index].fileName} draggable={false} src={image} />
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <LoadingSpinner />
  );
};

export default Carousel;
