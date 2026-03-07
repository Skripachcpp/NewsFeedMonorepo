// https://nuxt.com/docs/api/configuration/nuxt-config
import federation from "@originjs/vite-plugin-federation";

const authRemote =
  process.env.NUXT_PUBLIC_AUTH_REMOTE_URL || "http://localhost:5001/dist/assets/remoteEntry.js";
const newsRemote =
  process.env.NUXT_PUBLIC_NEWS_REMOTE_URL || "http://localhost:5002/dist/assets/remoteEntry.js";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:5058",
      authApiBaseUrl: process.env.NUXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:5164",
      authTokenCookieName: process.env.NUXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "auth_token",
    },
  },
  devServer: {
    port: 3000,
  },
  vite: {
    plugins: [
      federation({
        name: "host",
        remotes: {
          auth: authRemote,
          news: newsRemote,
        },
        shared: ["vue", "vue-router"],
      }),
    ],
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  },
});
