import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/", redirect: "/login" },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
