/**
 * Name: Vite type file
 *
 * Description: Handles the typing for vite so we can use our environment variables
 *
 * Date created: 22/04/26
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    REACT_APP_API_DEV: string;
    REACT_APP_API_PROD: string;
    REACT_APP_API_DEV_PORT: string;
    REACT_APP_API_PROD_PORT: string;
  }
}
