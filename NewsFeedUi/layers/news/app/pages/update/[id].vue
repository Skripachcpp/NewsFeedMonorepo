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
        placeholder="Введите теги через запятую, например: новости, технологии, спорт"
      />
    </template>

    <div v-if="errors" class="error-message">
      <div v-for="(error, i) of errors" :key="i">{{ error }}</div>
    </div>

    <div class="success-message" v-if="updatedArticleId != undefined">
      Новость успешно сохранена! ID: {{ updatedArticleId }}
    </div>

    <div class="buttons">
      <button class="btn btn-blue" :disabled="updateProcessed" @click="create">
        <span v-if="updateProcessed">Сохранить...</span>
        <span v-else>Сохранить изменения</span>
      </button>

      <NuxtLink to="/" class="btn btn-grey">
        <span>Вернуться к новостям</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleUpdateRequest } from "~/api/generated";
import { useApi } from "~/api/useApi";
import { errorToStrings } from "~/utils/error";

const api = useApi();

const route = useRoute();
const id = computed(() => Number(route.params.id));
let article = ref<ArticleUpdateRequest>();

let { errors, articleTagsInput, updateProcessed, updatedArticleId, create } =
  useUpdateArticle(article);

const { data: articleData, error: loadError } = await useAsyncData<ArticleUpdateRequest>(
  () => `update-article-${id.value}`,
  async () => {
    const numId = id.value;
    if (isNaN(numId)) throw new Error("Не валидный ID статьи");

    const data = await api.getArticle(numId);

    articleTagsInput.value = data?.tags?.join(", ") ?? "";

    let nextArticle: ArticleUpdateRequest = {
      id: data?.id ?? 0,
      content: data?.content ?? "",
      title: data?.title ?? "",
      summary: data?.summary ?? "",
      tags: data?.tags ?? [],
    };

    return nextArticle;
  },
  { watch: [id] },
);

watch(
  loadError,
  (e) => {
    errors.value = errorToStrings(e);
  },
  { immediate: true },
);
watch(articleData, (val) => (article.value = val), { immediate: true });
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
  font-size: 0.95rem;
}

.error-message {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.buttons {
  display: flex;
  gap: 12px;
}
</style>
