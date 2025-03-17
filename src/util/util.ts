/**
 * Date created : 20/02/2024
 *
 * Author : 28/02/2024
 *
 */

/**
 * Method to check whether the URL is valid
 * @param url : string
 * @returns bool
 */
export const isValidUrl = (url: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // validate fragment locator
  return !!urlPattern.test(url);
};

/**
 * @name generateUploadDate
 * @description a method which takes the uploadedAt property from a post and updates the format and returns it as a string
 *
 * @param date : string
 *
 * @returns uploadDate : string
 */
export const generateUploadDate = (date: string | number) => {
  const dateObject = new Date(date);

  // Generate variables before concatenating the string
  const YYYY = dateObject.getFullYear();
  const M = dateObject.getMonth() + 1;
  const D = dateObject.getDate();
  const H = dateObject.getHours();
  const I = dateObject.getMinutes();

  let MM = M.toString();
  let DD = D.toString();
  let HH = H.toString();
  let II = I.toString();

  // Formatting the date values to include 0 if it's less than 10
  if (M < 10) {
    MM = "0" + M.toString();
  }
  if (D < 10) {
    DD = "0" + D.toString();
  }
  if (H < 12) {
    HH = "0" + H.toString();
  }
  if (I < 10) {
    II = "0" + I.toString();
  }

  const uploadDate = `${YYYY}/${MM}/${DD} ${HH}:${II}`;

  return uploadDate;
};

/**
 * @name checkSessionValidation
 *
 * @description Performs an api request to the backend to check if the session is also on the backend
 * It's also supposed to create the session if it doesn't exist
 *
 * @param userId : string
 * @param token : string
 *
 * @returns sessionValid : boolean
 */
export const checkSessionValidation = async (userId: string, token: string) => {
  try {
    // Perform the signup request
    await fetch(`/graphql/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                    mutation checkCreateSessionResponse($userId : String!, $token : String){
                        checkCreateSessionResponse(userId : $userId, token : $token){
                            success
                            status
                            message
                        }
                    }
                `,
        variables: {
          userId,
          token,
        },
      }),
    });
  } catch (error) {
    console.log("Error");
    console.log(error);
  }
};

export const BASENAME = "/typescript-fullstack";
