/**
 * Date created: 23/04/2026
 *
 * Description: Configuration for the vite bundler to run our local dev server
 *
 * Author: Nothile Moyo
 *
 */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    define: {
      "process.env": env,
    },
  };
});
