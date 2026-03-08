<template>
  <div class="article-page">
    <NuxtLink to="/" class="btn btn-link">← Вернуться к списку</NuxtLink>

    <div v-if="pending" class="pending">
      <p>Загрузка новостей...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="article">
      <h2>{{ article.title }}</h2>
      <div>{{ article.content }}</div>

      <div class="news-info">
        <InfoItem label="Автор" :value="article.userName" />
        <InfoItem label="Дата" :value="dateFormat(article.publicationDate)" />
      </div>

      <TagItems :tags="article.tags?.filter((it) => it)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsArticleDto } from "~/api/generated";
import { useApi } from "~/api/useApi";
import { dateFormat } from "~/utils/date";
import { errorToString } from "~/utils/error";

const route = useRoute();
const api = useApi();

const id = computed(() => Number(route.params.id));

const {
  data: article,
  pending,
  error: loadError,
} = await useAsyncData<NewsArticleDto | null>(
  () => `news-article-${id.value}`,
  async () => {
    const numId = id.value;
    if (isNaN(numId)) throw new Error("Не валидный ID статьи");
    return await api.getArticle(numId);
  },
  { watch: [id], default: () => null },
);

let error = computed(() => errorToString(loadError, "Ошибка при загрузке новостей"));
</script>

<style scoped>
.news-info {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
