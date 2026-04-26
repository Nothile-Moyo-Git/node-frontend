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
  const S = dateObject.getSeconds();

  // Set the hours to a string and pad the start with 0 if needed
  const MM = M.toString().padStart(2, "0");
  const DD = D.toString().padStart(2, "0");
  const HH = H.toString().padStart(2, "0");
  const II = I.toString().padStart(2, "0");
  const SS = S.toString().padStart(2, "0");

  const uploadDate = `${YYYY}/${MM}/${DD} ${HH}:${II}:${SS}`;

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
export const checkSessionValidation = async (userId: string, token: string, baseUrl: string) => {
  try {
    // Perform the signup request
    await fetch(`${baseUrl}/graphql/auth`, {
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
    console.error("Error with check session");
    console.error(error);
  }
};

export const BASENAME = "";
