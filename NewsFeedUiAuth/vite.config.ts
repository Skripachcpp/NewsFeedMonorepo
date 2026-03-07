import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        "./Login": "./src/views/Login.vue",
        "./Register": "./src/views/Register.vue",
      },
      shared: ["vue", "vue-router"],
    }),
  ],
  server: {
    port: 5001,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
