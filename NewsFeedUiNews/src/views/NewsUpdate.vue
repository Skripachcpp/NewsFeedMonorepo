<template>
  <div class="create">
    <h1>Обновить новость</h1>
    <template v-if="article">
      <FieldForm
        v-model="article.title"
        type="text"
        label="Заголовок"
        placeholder="Введите заголовок новости"
        required
      />
      <FieldForm
        v-model="article.content"
        type="textarea"
        label="Содержание"
        placeholder="Введите содержание новости"
        required
      />
      <FieldForm
        v-model="article.summary"
        type="textarea"
        label="Краткое описание"
        placeholder="Введите краткое описание (опционально)"
      />
      <FieldForm
        v-model="articleTagsInput"
        type="text"
        label="Теги (опционально)"
        placeholder="Введите теги через запятую"
      />
    </template>
    <div v-if="errors?.length" class="error-message">
      <div v-for="(err, i) of errors" :key="i">{{ err }}</div>
    </div>
    <div v-if="updatedArticleId != null" class="success-message">
      Новость успешно сохранена! ID: {{ updatedArticleId }}
    </div>
    <div class="buttons">
      <button type="button" class="btn btn-blue" :disabled="updateProcessed" @click="create">
        <span v-if="updateProcessed">Сохранить...</span>
        <span v-else>Сохранить изменения</span>
      </button>
      <router-link to="/" class="btn btn-grey">Вернуться к новостям</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { ArticleUpdateRequest } from "@news-feed/shared";
import { api } from "../api";
import FieldForm from "../components/FieldForm.vue";
import { useUpdateArticle } from "../composables/useUpdateArticle";

const route = useRoute();
const article = ref<ArticleUpdateRequest | undefined>();

const { errors, articleTagsInput, updateProcessed, updatedArticleId, create } = useUpdateArticle(article);

onMounted(async () => {
  const id = Number(route.params.id);
  if (Number.isNaN(id)) return;
  const data = await api.getArticle(id);
  article.value = {
    id: data.id ?? 0,
    content: data.content ?? "",
    title: data.title ?? "",
    summary: data.summary ?? "",
    tags: data.tags ?? [],
  };
  articleTagsInput.value = data?.tags?.join(", ") ?? "";
});

watch(
  () => route.params.id,
  async () => {
    const id = Number(route.params.id);
    if (Number.isNaN(id)) return;
    const data = await api.getArticle(id);
    article.value = {
      id: data.id ?? 0,
      content: data.content ?? "",
      title: data.title ?? "",
      summary: data.summary ?? "",
      tags: data.tags ?? [],
    };
    articleTagsInput.value = data?.tags?.join(", ") ?? "";
  }
);
</script>

<style scoped>
.create {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.success-message {
  background: #c6f6d5;
  border: 1px solid #68d391;
  color: #22543d;
  padding: 1rem;
  border-radius: 6px;
}
.error-message {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 1rem;
  border-radius: 6px;
}
.buttons {
  display: flex;
  gap: 12px;
}
</style>
