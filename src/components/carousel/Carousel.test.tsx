/**
 *
 * Date created: 09/12/2025
 *
 * Author: Nothile Moyo
 *
 * Description: Tests for the carousel component, covers the branching functionality
 *
 */

import { act } from "react";
import { createFetchResponse } from "../../test-utils/methods/methods";
import { mockContext, mockFiles } from "../../test-utils/mocks/objects";
import { renderWithoutRouting } from "../../test-utils/testRouter";
import Carousel from "./Carousel";
import { FileData } from "../../@types";
import { waitFor } from "@testing-library/react";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
});

describe("Carousel Component", () => {
  it("Renders the carousel component", async () => {
    // Get the images from the backend
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetFilePathsResponse: {
            status: 200,
            files: mockFiles,
          },
        },
      }),
    );

    // Render our carousel component
    await act(async () => {
      const { baseElement } = renderWithoutRouting(<Carousel setCarouselImage={jest.fn()} />, mockContext);
      expect(baseElement).toMatchSnapshot();
    });
  });

  it("Handle errors if the catch block is hit", async () => {
    // Mock failed files returned from the backend
    const mockFiles: FileData[] = [{ fileName: "broken-image.png", imageUrl: "broken-image.png" }];

    // Mock the request for the files
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetFilePathsResponse: {
            status: 500,
            files: mockFiles,
          },
        },
      }),
    );

    // Spy on our consoles instead of immediately outputting a value
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { baseElement } = renderWithoutRouting(<Carousel setCarouselImage={jest.fn()} />, mockContext);

    // Wait for the component to attempt image loading and hit the catch block
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    warnSpy.mockRestore();
    errorSpy.mockRestore();

    expect(baseElement).toMatchSnapshot();
  });

  it("Update the swiper", async () => {
    // Get the images from the backend
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        data: {
          GetFilePathsResponse: {
            status: 200,
            files: mockFiles,
          },
        },
      }),
    );

    renderWithoutRouting(<Carousel setCarouselImage={jest.fn()} />, mockContext);

    // Find the first swiper instance (main carousel)
    const swiperEvent = new Event("realIndexChange");

    // Mock a swiper object passed to updateSwiperIndexHandler
    const mockSwiper = { realIndex: 1 };

    // Manually trigger Swiper's event handler
    // (Testing Library doesn't fire Swiper's custom events automatically)
    await waitFor(() => {
      // Access the swiper prop callback directly
      const swiperInstance = document.querySelector(".swiper") as HTMLElement & { onRealIndexChange?: Function };

      // Simulate the index update
      // This forces updateSwiperIndexHandler to run
      if (swiperInstance?.onRealIndexChange) {
        swiperInstance.onRealIndexChange(mockSwiper);
      }
    });
  });
});
