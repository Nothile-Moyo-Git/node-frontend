/**
 * Date created : 01/10/2025
 * Author : Nothile Moyo
 *
 * Test routing file, this will create routes which can be used in Jest for testing
 * We use this to be able to render our components
 *
 */

import { ReactNode } from "react";

// Mock swiper and swiper slide
export const Swiper = ({ children, ...props }: { children: ReactNode }) => {
  <div data-testid="swiper" {...props}>
    {children}
  </div>;
};

export const SwiperSlide = ({ children, ...props }: { children: ReactNode }) => {
  <div data-testid="swiper-slide" {...props}>
    {children}
  </div>;
};

export const Pagination = {};
export const Navigation = {};
export const Autoplay = {};
export const Thumbs = {};
export const FreeMode = {};

export default {
  Swiper,
  SwiperSlide,
  Pagination,
  Navigation,
  Autoplay,
  Thumbs,
  FreeMode,
};
