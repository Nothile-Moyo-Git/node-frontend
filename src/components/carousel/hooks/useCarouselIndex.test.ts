/**
 * Date created: 11/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Testing for the carousel hook file, this is done to deal with the index update not being mockable
 * And also implementing a healthy separation of concerns
 */

import { renderHook, act } from "@testing-library/react";
import { useCarouselIndex } from "./useCarouselIndex";
import type { Swiper as SwiperCore } from "swiper";

describe("useCarouselIndex hook", () => {
  it("updates currentIndex when Swiper changes", () => {
    // Instantiate our hook
    const { result } = renderHook(() => useCarouselIndex());

    // We mock our swiper naturally updating by passing the realIndex as SwiperCore
    // This is for the method onRealIndexChange
    const swiperMock = { realIndex: 2 } as SwiperCore;

    // Mock updating the index naturally
    act(() => {
      result.current.updateIndex(swiperMock);
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it("sets chosenImageIndex when chooseImage is called", () => {
    const { result } = renderHook(() => useCarouselIndex());

    act(() => {
      result.current.updateIndex({ realIndex: 1 } as SwiperCore);
    });

    act(() => {
      result.current.chooseImage();
    });

    expect(result.current.chosenImageIndex).toBe(1);
  });
});
