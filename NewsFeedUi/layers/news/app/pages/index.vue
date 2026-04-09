<template>
  <div>
    <div v-if="isAuthenticated" class="header">
      <NuxtLink to="/tags" class="btn btn-red news-btn-create">Теги</NuxtLink>
      <NuxtLink to="/create" class="btn btn-blue news-btn-create">Создать</NuxtLink>
    </div>

    <div v-if="pending" class="pending">
      <p>Загрузка новостей...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button class="btn btn-link" @click="handlerLoadNews">Попробовать снова</button>
    </div>

    <div v-else class="news-list">
      <div class="news-item" v-for="article in articlesPage.items" :key="article.id">
        <div class="news-item-left">
          <h2 class="news-title">{{ article.title }}</h2>

          <p v-if="article.summary" class="news-summary">
            {{ article.summary }}
          </p>

          <div class="news-info">
            <InfoItem label="Автор" :value="article.userName" />
            <InfoItem label="Дата" :value="dateFormat(article.publicationDate)" />
          </div>

          <TagItems :tags="article.tags" />

          <NuxtLink :to="`news/${article.id}`" class="btn btn-link">Читать далее →</NuxtLink>
        </div>
        <div class="news-item-right">
          <div v-if="isAuthenticated" class="news-buttons">
            <NuxtLink :to="'/update/' + article.id" class="btn btn-green">Изменить</NuxtLink>
            <button class="btn btn-red" @click="deleteArticleId = article.id">Удалить</button>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button class="btn btn-link" :disabled="currentPage === 1" @click="goToPrevPage">
          Назад
        </button>
        <span class="pagination-text">Страница {{ currentPage }} из {{ totalPages }}</span>
        <button class="btn btn-link" :disabled="currentPage === totalPages" @click="goToNextPage">
          Вперед
        </button>
      </div>
    </div>

    <ConfirmDeleteModal
      :is-open="deleteArticleId != null"
      item-type="новость"
      @confirm="confirmDeleteArticle"
      @cancel="deleteArticleId = undefined"
    />
  </div>
</template>

<script setup lang="ts">
import type { NewsArticleDto } from "~/api/generated";
import { useApi } from "~/api/useApi";
import { useAuth } from "~/api/useAuth";
import { dateFormat } from "~/utils/date";
import { errorToString } from "~/utils/error";

const api = useApi();

let { isAuthenticated } = useAuth();
const pageSize = 2;
const currentPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(articlesPage.value.totalItems / pageSize)));

const {
  data: articlesPage,
  pending,
  error: loadError,
  refresh: loadNews,
} = await useAsyncData<{
  items: NewsArticleDto[];
  totalItems: number;
}>(
  "news-list",
  async () => {
    const response = await api.getArticles({
      offset: (currentPage.value - 1) * pageSize,
      count: pageSize,
    });

    let articlesPage = {
      items: response.items ?? [],
      totalItems: response.total ?? 0,
    };

    return articlesPage;
  },
  {
    default: () => ({
      items: [],
      totalItems: 0,
    }),
    watch: [currentPage],
  },
);

let handlerLoadNews = () => {
  loadNews();
};

let error = computed(() => errorToString(loadError, "Ошибка при загрузке новостей"));

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const deleteArticleId = ref<number>();

const confirmDeleteArticle = async () => {
  if (deleteArticleId.value == null) return;

  await api.deleteArticle(deleteArticleId.value);

  if (articlesPage.value.totalItems > 0) {
    articlesPage.value.totalItems -= 1;
  }

  if ((articlesPage.value.items?.length ?? 0) <= 1 && currentPage.value > 1) {
    currentPage.value -= 1;
    deleteArticleId.value = undefined;
    return;
  }

  await loadNews();
  deleteArticleId.value = undefined;
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.news-list {
  position: relative;
  display: grid;
  gap: 24px;
}

.news-item {
  border: 1px #666 solid;
  padding: 8px 16px;
  border-radius: 5px;

  display: flex;
  justify-content: space-between;
}

.news-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-summary {
  margin-top: 8px;
}

.news-info {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.news-btn-create {
  margin-right: 18px;
  width: 100px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination-text {
  color: #bbb;
}
</style>
