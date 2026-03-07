import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "host",
      remotes: {
        auth: "http://localhost:5001/assets/remoteEntry.js",
        news: "http://localhost:5002/assets/remoteEntry.js",
      },
      shared: ["vue", "vue-router"],
    }),
  ],
  server: {
    port: 5000,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
