import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "news",
      filename: "remoteEntry.js",
      exposes: {
        "./NewsList": "./src/views/NewsList.vue",
        "./NewsDetail": "./src/views/NewsDetail.vue",
        "./NewsCreate": "./src/views/NewsCreate.vue",
        "./NewsUpdate": "./src/views/NewsUpdate.vue",
        "./TagsPage": "./src/views/TagsPage.vue",
      },
      shared: ["vue", "vue-router"],
    }),
  ],
  server: {
    port: 5002,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
