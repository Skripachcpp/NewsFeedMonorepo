import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import NewsList from "./views/NewsList.vue";
import NewsDetail from "./views/NewsDetail.vue";
import NewsCreate from "./views/NewsCreate.vue";
import NewsUpdate from "./views/NewsUpdate.vue";
import TagsPage from "./views/TagsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: NewsList },
    { path: "/news/:id", component: NewsDetail },
    { path: "/create", component: NewsCreate },
    { path: "/update/:id", component: NewsUpdate },
    { path: "/tags", component: TagsPage },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
