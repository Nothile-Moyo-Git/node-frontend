/**
 * Date created : 01/10/2025
 * Author : Nothile Moyo
 *
 * Test routing file, this will create routes which can be used in Jest for testing
 * We use this to be able to render our components
 *
 */

import { ReactNode } from "react";

interface SwiperProps {
  children: ReactNode;
  className?: string;
  modules?: unknown;
  navigation?: unknown;
  pagination?: unknown;
  autoplay?: unknown;
  thumbs?: unknown;
  loop?: unknown;
  centeredSlides?: unknown;
  slidesPerView?: unknown;
  spaceBetween?: unknown;
  watchSlidesProgress?: unknown;
  breakpoints?: unknown;
  onSwiper?: unknown;
  onRealIndexChange?: unknown;
  [key: string]: unknown;
}

// Convert the values to data attributes so we can send them through
const toDataAttributes = (props: Omit<SwiperProps, "children" | "className">) =>
  Object.fromEntries(Object.entries(props).map(([key, value]) => [`data-${key.toLowerCase()}`, JSON.stringify(value)]));

// Mock swiper and swiper slide
export const Swiper = ({ children, className, ...rest }: SwiperProps) => {
  return (
    <div data-testid="swiper" className={className?.toString()} {...toDataAttributes(rest)}>
      {children}
    </div>
  );
};

export const SwiperSlide = ({ children, ...props }: { children: ReactNode }) => (
  <div data-testid="swiper-slide" {...props}>
    {children}
  </div>
);

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
