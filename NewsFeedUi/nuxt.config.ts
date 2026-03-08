// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  extends: ["./layers/auth", "./layers/news"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:5058",
      authApiBaseUrl: process.env.NUXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:5164",
      authTokenCookieName: process.env.NUXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "auth_token",
    },
  },
});
