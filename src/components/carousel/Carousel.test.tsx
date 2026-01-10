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
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock key jest functionality here, this covers fetch, alert, and window.reload
let mockFetch: jest.MockedFunction<typeof fetch>;

// Clear our tests and get mock our fetch so we get the correct ordering
beforeEach(() => {
  mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  global.fetch = mockFetch;
});

afterEach(() => {
  jest.clearAllMocks();
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

    // Render and update our component so we can see it being rendered
    const { baseElement } = await act(async () => {
      return renderWithoutRouting(
        <Carousel setCarouselImage={jest.fn()} isValid={true} setIsValid={jest.fn()} />,
        mockContext,
      );
    });

    // Render our carousel component
    expect(baseElement).toMatchSnapshot();
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

    renderWithoutRouting(<Carousel setCarouselImage={jest.fn()} isValid={true} setIsValid={jest.fn()} />, mockContext);

    // Wait for the component to attempt image loading and hit the catch block
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("Updates the swiper", async () => {
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

    // Render and update our component so we can see it being rendered
    const { baseElement } = await act(async () => {
      return renderWithoutRouting(
        <Carousel setCarouselImage={jest.fn()} isValid={true} setIsValid={jest.fn()} />,
        mockContext,
      );
    });

    // Choose an image and select it
    const chooseImageButton = screen.getByTestId("test-id-carousel-choose-button");

    userEvent.click(chooseImageButton);

    expect(baseElement).toMatchSnapshot();
  });

  it("Successfully gets an empty list of files", async () => {
    // Get the images from the backend
    // Pass an empty array here to skip the call to set the
    mockFetch.mockResolvedValueOnce(
      createFetchResponse(
        {
          data: {
            GetFilePathsResponse: {
              status: 200,
              files: [],
            },
          },
        },
        418,
      ),
    );

    // Render and update our component so we can see it being rendered
    const { baseElement } = await act(async () => {
      return renderWithoutRouting(
        <Carousel setCarouselImage={jest.fn()} isValid={true} setIsValid={jest.fn()} />,
        mockContext,
      );
    });

    expect(baseElement).toMatchSnapshot();
  });

  it("Handles fetch failure and triggers the first catch block", async () => {
    // Make fetch throw an actual error
    mockFetch.mockRejectedValueOnce(new Error("Network failed"));

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderWithoutRouting(<Carousel setCarouselImage={jest.fn()} isValid={true} setIsValid={jest.fn()} />, mockContext);

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith("GetFilePathsResponse query failed, view error below");
      expect(errorSpy).toHaveBeenCalled();
    });

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
