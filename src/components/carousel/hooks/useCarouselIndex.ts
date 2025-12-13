/**
 * Date created: 11/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Testing for the carousel hook file, this is done to deal with the index update not being mockable
 * And also implementing a healthy separation of concerns
 */

import { useState } from "react";
import type { Swiper as SwiperCore } from "swiper";

export const useCarouselIndex = () => {
  // Declare the current state of the swiper and the Carousel component
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [chosenImageIndex, setChosenImageIndex] = useState<number | null>(null);

  // Called when Swiper changes slide
  const updateIndex = (swiper: SwiperCore) => {
    setCurrentIndex(swiper.realIndex);
  };

  // Called when user chooses an image
  const chooseImage = () => {
    setChosenImageIndex(currentIndex);
    return currentIndex;
  };

  return { currentIndex, chosenImageIndex, updateIndex, chooseImage };
};
