<template>
  <div class="create">
    <h1>Создать новость</h1>
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
      v-model="tagsInput"
      type="text"
      label="Теги (опционально)"
      placeholder="Введите теги через запятую, например: новости, технологии, спорт"
    />
    <div v-if="errors" class="error-message">
      <div v-for="(err, i) of errors" :key="i">{{ err }}</div>
    </div>
    <div v-if="createdArticleSuccess" class="success-message">
      Новость успешно создана! ID: {{ createdArticleId }}
    </div>
    <div class="buttons">
      <button type="button" class="btn btn-blue" :disabled="createdProcessing" @click="create">
        <span v-if="createdProcessing">Создание...</span>
        <span v-else>Создать новость</span>
      </button>
      <router-link to="/" class="btn btn-grey">Вернуться к новостям</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import FieldForm from "../components/FieldForm.vue";
import { useCreateArticle } from "../composables/useCreateArticle";

const {
  errors,
  article,
  tagsInput,
  createdArticleId,
  createdArticleSuccess,
  createdProcessing,
  create,
} = useCreateArticle();
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
