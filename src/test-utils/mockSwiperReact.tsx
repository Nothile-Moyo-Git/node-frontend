/**
 * Date created : 01/10/2025
 * Author : Nothile Moyo
 *
 * Test routing file, this will create routes which can be used in Jest for testing
 * We use this to be able to render our components
 *
 */

import { ReactElement } from "react";

export const Swiper = (children: ReactElement) => (
  <div data-testid="swiper">{children}</div>
);

export const SwiperSlide = (children: ReactElement) => {
  <div data-testid="swiper-slide">{children}</div>;
};

export default {
  Swiper,
  SwiperSlide,
};
