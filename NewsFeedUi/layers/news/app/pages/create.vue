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
      <div v-for="(error, i) of errors" :key="i">{{ error }}</div>
    </div>

    <div class="success-message" v-if="createdArticleSuccess">
      Новость успешно создана! ID: {{ createdArticleId }}
    </div>

    <div class="buttons">
      <button class="btn btn-blue" :disabled="createdProcessing" @click="create">
        <span v-if="createdProcessing">Создание...</span>
        <span v-else>Создать новость</span>
      </button>

      <NuxtLink to="/" class="btn btn-grey">
        <span>Вернуться к новостям</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
let {
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
