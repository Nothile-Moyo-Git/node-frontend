/**
 * Author : Nothile Moyo
 * Date Published : 01/04/2024
 * License : MIT
 *
 * This is the file manager file in the utils folder
 * It handles functionality such as deleting files when a product is deleted, and replacing it when it gets updated
 */

import { FileRequestData } from "../../src/@types/index";

/**
 * @name generateBase64FromImage
 *
 * @description This method converts an uploaded image on the frontend to base64 encode. This allows it to be sent to the backend and converted back into an image
 *
 * @param imageFile : File
 *
 * @returns promise : Promise<unknown> (A result of the query conversion to base64)
 */

export const generateBase64FromImage = (imageFile: File) => {
  // Initiate our file reader
  const reader = new FileReader();

  // Read the file and encode it in base 64
  const promise = new Promise((resolve, reject) => {
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target) {
        resolve(event.target.result);
      }
    };

    reader.onerror = (err) => reject(err);
  });

  reader.readAsDataURL(imageFile);

  return promise;
};

/**
 * @name findImagePathFromPostData
 *
 * @params filename : string, uploadPath : string
 *
 * @description This method finds the upload folder and the appropriate month and year
 */
export const findImagePathFromPostData = () => {
  return "hello world";
};

/**
 * @name getCurrentMonthAndYear
 *
 * @description : This method gets the current month and year in a YYYY-MM format
 *
 * @returns string
 */
export const getCurrentMonthAndYear = () => {
  const date = new Date();

  // Get current month and year and concatenate them in a string
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  // Format the month to work appropriately
  let stringMonth = currentMonth.toString();
  if (currentMonth < 10) {
    stringMonth = "0" + currentMonth.toString();
  }

  return `${currentYear}/${stringMonth}`;
};

/**
 * @name fileUploadHandler
 *
 * @description Handles the fileupload for the frontend, calls the api request too and returns the appropriate response
 *
 * @param uploadFile : File
 */
export const fileUploadHandler = async (uploadFile: File, baseUrl: string) => {
  const fields = new FormData();
  fields.append("image", uploadFile);

  // File upload response
  const fileUploadResponse = await fetch(`${baseUrl}/rest/post/file-upload`, {
    method: "POST",
    body: fields,
  });

  // Get the file data we need to send to the api request
  const fileUploadData = await fileUploadResponse.json();

  const fileData: FileRequestData = {
    fileName: fileUploadData.fileName,
    fileLastUpdated: fileUploadData.fileLastUpdated,
    imageUrl: fileUploadData.imageUrl,
    isFileValid: fileUploadData.isFileValid,
    isFileSizeValid: fileUploadData.isFileSizeValid,
    isFileTypeValid: fileUploadData.isFileTypeValid,
    isImageUrlValid: fileUploadData.isImageUrlValid,
  };

  return fileData;
};
