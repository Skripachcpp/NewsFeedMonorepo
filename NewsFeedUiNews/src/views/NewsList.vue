<template>
  <div>
    <div v-if="authenticated" class="header">
      <router-link to="/tags" class="btn btn-red news-btn-create">Теги</router-link>
      <router-link to="/create" class="btn btn-blue news-btn-create">Создать</router-link>
    </div>
    <div v-if="pending" class="pending">
      <p>Загрузка новостей...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button type="button" class="btn btn-link" @click="loadNews">Попробовать снова</button>
    </div>
    <div v-else class="news-list">
      <div v-for="article in articles" :key="article.id" class="news-item">
        <div class="news-item-left">
          <h2 class="news-title">{{ article.title }}</h2>
          <p v-if="article.summary" class="news-summary">{{ article.summary }}</p>
          <div class="news-info">
            <InfoItem label="Автор" :value="article.userName" />
            <InfoItem label="Дата" :value="dateFormat(article.publicationDate)" />
          </div>
          <TagItems :tags="article.tags" />
          <router-link :to="`/news/${article.id}`" class="btn btn-link">Читать далее →</router-link>
        </div>
        <div v-if="authenticated" class="news-item-right">
          <div class="news-buttons">
            <router-link :to="`/update/${article.id}`" class="btn btn-green">Изменить</router-link>
            <button type="button" class="btn btn-red" @click="deleteArticleId = article.id">Удалить</button>
          </div>
        </div>
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
import { ref, computed, onMounted } from "vue";
import { dateFormat } from "@news-feed/shared";
import { errorToString } from "@news-feed/shared";
import { isAuthenticated } from "@news-feed/shared";
import { api } from "../api";
import type { NewsArticleDto } from "@news-feed/shared";
import InfoItem from "../components/InfoItem.vue";
import TagItems from "../components/TagItems.vue";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.vue";
import { useDeleteArticle } from "../composables/useDeleteArticle";

const authenticated = computed(() => isAuthenticated());
const articles = ref<NewsArticleDto[]>([]);
const pending = ref(true);
const loadError = ref<unknown>(null);

async function loadNews() {
  pending.value = true;
  loadError.value = null;
  try {
    articles.value = await api.getArticles();
  } catch (e) {
    loadError.value = e;
  } finally {
    pending.value = false;
  }
}

const error = computed(() => errorToString(loadError.value, "Ошибка при загрузке новостей"));
const { deleteArticleId, confirmDeleteArticle } = useDeleteArticle(articles);

onMounted(loadNews);
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.news-list {
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
</style>
