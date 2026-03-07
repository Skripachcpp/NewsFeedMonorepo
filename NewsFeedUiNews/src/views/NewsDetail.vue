<template>
  <div class="article-page">
    <router-link to="/" class="btn btn-link">← Вернуться к списку</router-link>
    <div v-if="pending" class="pending">
      <p>Загрузка новостей...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="article">
      <h2>{{ article.title }}</h2>
      <div>{{ article.content }}</div>
      <div class="news-info">
        <InfoItem label="Автор" :value="article.userName" />
        <InfoItem label="Дата" :value="dateFormat(article.publicationDate)" />
      </div>
      <TagItems :tags="article.tags?.filter(Boolean)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { dateFormat, errorToString } from "@news-feed/shared";
import { api } from "../api";
import type { NewsArticleDto } from "@news-feed/shared";
import InfoItem from "../components/InfoItem.vue";
import TagItems from "../components/TagItems.vue";

const route = useRoute();
const article = ref<NewsArticleDto | null>(null);
const pending = ref(true);
const loadError = ref<unknown>(null);

async function loadArticle() {
  const id = Number(route.params.id);
  if (Number.isNaN(id)) {
    loadError.value = new Error("Не валидный ID статьи");
    pending.value = false;
    return;
  }
  pending.value = true;
  loadError.value = null;
  try {
    article.value = await api.getArticle(id);
  } catch (e) {
    loadError.value = e;
  } finally {
    pending.value = false;
  }
}

const error = computed(() => errorToString(loadError.value, "Ошибка при загрузке новостей"));

onMounted(loadArticle);
watch(() => route.params.id, loadArticle);
</script>

<style scoped>
.news-info {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
