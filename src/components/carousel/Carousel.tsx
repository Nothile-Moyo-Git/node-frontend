/**
 * Date Created : 20/04/2024
 *
 * Author : Nothile Moyo
 *
 * PostCard component
 * Wraps an article in a card component in order to be rendered in a list
 */

import { useContext, useEffect, useState } from "react";
import { FileData } from "../../@types";
import { Carousel } from "react-responsive-carousel";
import { AppContext } from "../../context/AppContext";

const CarouselWrapper = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const appContextInstance = useContext(AppContext);

  useEffect(() => {
    let filePaths: FileData[] = [];
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
        filePaths = files;
      }
    };

    const retrieveImages = async () => {
      try {
        if (filePaths.length > 0) {
          const renderableImages = await Promise.all(
            filePaths.map(async (file: FileData) => {
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
    generateImageSources();
    retrieveImages();
  }, []);

  return (
    <Carousel>
      {images.map((image, index) => (
        <div key={files[index].fileName}>
          <img alt={files[index].fileName} src={image} />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselWrapper;
