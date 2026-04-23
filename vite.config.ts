import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import requireSupport from "vite-plugin-require-support";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), requireSupport()],
    server: {
      port: 3000,
    },
    define: {
      "process.env": env,
    },
  };
});
