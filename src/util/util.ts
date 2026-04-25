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

/**
 * @name doesUserExist
 *
 * @description This function makes sure that the user exists, this is in order to logout a user who no longer exists
 *
 * @param userId: string
 * @param baseUrl: string
 * @param token: string
 *
 * @returns userExists: boolean
 */
export const doesUserExist = async (userId: string, baseUrl: string, token?: string) => {
  const response = await fetch(`${baseUrl}/graphql/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query PostUserDetailsResponse($_id : String!, $token : String!){
          PostUserDetailsResponse(_id : $_id, token : $token){
            user {
              _id
              name
              email
              password
              confirmPassword
              status
              posts
            }
            sessionCreated
            sessionExpires
            success
            }
          }
        `,
      variables: {
        _id: userId,
        token: token ?? "",
      },
    }),
  });

  // Get the result from the endpoint
  const {
    data: {
      PostUserDetailsResponse: { user },
    },
  } = await response.json();

  // Check if there is no user but the request was successful
  if (!user) {
    // Perform the logout request
    await fetch(`${baseUrl}/graphql/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                    mutation deleteSessionResponse($_id : String!){
                        deleteSessionResponse(_id : $_id){
                            success,
                            message
                        }
                    }
                `,
        variables: {
          _id: userId,
        },
      }),
    });
  }

  const userExists = user !== null;

  return userExists;
};

export const BASENAME = "";
