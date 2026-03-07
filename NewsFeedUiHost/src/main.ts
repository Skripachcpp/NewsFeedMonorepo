import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { setConfig } from "@news-feed/shared";
import App from "./App.vue";
import Layout from "./Layout.vue";

const app = createApp(App);

setConfig({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5058",
  authApiBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:5164",
  authTokenCookieName: import.meta.env.VITE_AUTH_TOKEN_COOKIE_NAME || "auth_token",
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        { path: "", name: "Home", component: () => import("news/NewsList") },
        { path: "news/:id", name: "NewsDetail", component: () => import("news/NewsDetail") },
        { path: "create", name: "NewsCreate", component: () => import("news/NewsCreate") },
        { path: "update/:id", name: "NewsUpdate", component: () => import("news/NewsUpdate") },
        { path: "tags", name: "Tags", component: () => import("news/TagsPage") },
        { path: "login", name: "Login", component: () => import("auth/Login") },
        { path: "register", name: "Register", component: () => import("auth/Register") },
      ],
    },
  ],
});

app.use(router);
app.mount("#app");
