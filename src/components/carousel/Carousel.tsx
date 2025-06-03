/**
 * Date Created : 24/04/2025
 *
 * Author : Nothile Moyo
 *
 * PostCard component
 * Wraps an article in a card component in order to be rendered in a list
 */

import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
  Autoplay,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import React, {
  FC,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { AppContext } from "../../context/AppContext";
import { FileData } from "../../@types";
import LoadingSpinner from "../loader/LoadingSpinner";
import Button from "../button/Button";

// Types
import type { Swiper as SwiperI } from "swiper/types";

// Default swiper styles
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import "swiper/scss/thumbs";

// My styles, these override the swiper styles since they're defined later
// Make sure that these are scoped more than the default styling if the override doesn't work
import "./Carousel.scss";

interface ComponentProps {
  setCarouselImage: Dispatch<SetStateAction<FileData | undefined>>;
}

const Carousel: FC<ComponentProps> = ({ setCarouselImage }) => {
  // Image and thumb state for the swiper to work effectively
  const [files, setFiles] = useState<FileData[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperI | string | null>(
    null,
  );

  // We store the index in state since we want our button to be outside of the swiper carousel
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [chosenImageIndex, setChosenImageIndex] = useState<number | null>();

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
                                      imageUrl
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
      // Import the static images in node
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

  // We update our index in state so we can keep our button to choose a slide in place instead of rendering multiple buttons
  const updateSwiperIndexHandler = (swiper: SwiperClass) => {
    setCurrentIndex(swiper.realIndex);
  };

  const setChosenImageHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    setCarouselImage(files[currentIndex]);
    setChosenImageIndex(currentIndex);
  };

  return images.length > 0 ? (
    <section className="carousel">
      <div className="carousel__chosen-image">
        <Button variant="primary" onClick={setChosenImageHandler}>
          Choose this image
        </Button>
        <p>
          Chosen image:
          {chosenImageIndex || chosenImageIndex === 0
            ? ` ${files[chosenImageIndex].fileName}`
            : " None"}
        </p>
      </div>
      {/* Main carousel */}
      <Swiper
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
        }}
        centeredSlides
        loop={true}
        modules={[Pagination, Navigation, Autoplay, Thumbs]}
        navigation
        onRealIndexChange={updateSwiperIndexHandler}
        pagination={{
          type: "bullets",
          clickable: true,
        }}
        slidesPerView={1}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={files[index].fileName}>
            <img
              alt={files[index].fileName}
              className={
                chosenImageIndex === index
                  ? "swiper__image swiper__image--chosen"
                  : "swiper__image"
              }
              draggable={false}
              src={image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Carousel thumbnails */}
      <Swiper
        breakpoints={
          320: {
            slidesPerView: 1
          }
        }
        modules={[Thumbs, FreeMode, Navigation]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={1}
        watchSlidesProgress
      >
        {images.map((image, index) => (
          <SwiperSlide key={files[index].fileName}>
            <img
              alt={files[index].fileName}
              className={
                chosenImageIndex === index
                  ? "swiper__thumbnail swiper__thumbnail--chosen"
                  : "swiper__thumbnail"
              }
              draggable={false}
              src={image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  ) : (
    <LoadingSpinner />
  );
};

export default Carousel;
