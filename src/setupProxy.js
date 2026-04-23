/* eslint-disable prettier/prettier */
const { createProxyMiddleware } = require("http-proxy-middleware");

// Set endpoints based on our .env configuration, the NODE_ENV is set in the package.json scripts
const target =
  import.meta.env.MODE.trim() === "development"
    ? import.meta.env.VITE_API_DEV
    : import.meta.env.VITE_API_PROD;

module.exports = function (app) {
  // Handle GraphQL endpoints
  app.use(
    "/graphql",
    createProxyMiddleware({
      target: `${target}/graphql`,
      changeOrigin: true,
    }),
  );

  // Handle rest endpoints which aren't handled by GraphQL
  app.use(
    "/rest",
    createProxyMiddleware({
      target: `${target}/rest`,
      changeOrigin: true,
    }),
  );

  // Handle websocket endpoints for socketIO
  app.use(
    "/chat",
    createProxyMiddleware({
      target: `${target}/chat`,
      changeOrigin: true,
    }),
  )
};
