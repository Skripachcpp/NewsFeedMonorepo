<template>
  <div class="tags-page">
    <div class="container">
      <div class="page-header">
        <NuxtLink to="/" class="back-link">← Назад к списку новостей</NuxtLink>
        <h1>Теги</h1>
      </div>

      <div v-if="pendingTags" class="loading">
        <p>Загрузка тегов...</p>
      </div>

      <div v-else-if="error || deleteError" class="error">
        <p>{{ error || deleteError }}</p>
        <button class="btn btn-secondary" @click="handlerLoadTags">Попробовать снова</button>
      </div>

      <div v-else-if="tags.length === 0" class="empty">
        <p>Тегов пока нет</p>
      </div>

      <div v-else class="tags-list">
        <div v-for="tag in tags" :key="tag.id" class="tag-card">
          <div class="tag-content">
            <div class="tag-info">
              <h3 class="tag-name">{{ tag.name }}</h3>
            </div>
            <div class="tag-actions">
              <button
                v-if="tag.id"
                class="btn btn-delete"
                :disabled="deletingId === tag.id"
                @click="
                  () => {
                    tagToDelete = { id: tag.id ?? -1, name: tag.name ?? '' };
                  }
                "
              >
                {{ deletingId === tag.id ? "Удаление..." : "Удалить" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      :is-open="!!tagToDelete"
      :title="tagToDelete?.name || ''"
      :loading="deletingId != null"
      item-type="тег"
      @confirm="confirmDelete"
      @cancel="tagToDelete = undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { useApi } from "~/api/useApi";
import type { TagDto } from "~/api/generated";
import { errorToString } from "~/utils/error";

const api = useApi();

const {
  data: tags,
  pending: pendingTags,
  error: loadError,
  refresh: loadTags,
} = await useAsyncData<TagDto[]>("tags-list", api.getTags, { default: () => [] });

let handlerLoadTags = () => {
  loadTags();
};

let error = computed(() => errorToString(loadError));

let { deletingId, deleteError, tagToDelete, confirmDelete } = useDeleteTags(tags);
</script>

<style scoped>
.tags-page {
  padding: 2rem;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  color: #667eea;
  font-weight: 500;
  transition: color 0.3s ease;
  text-decoration: none;
}

.back-link:hover {
  color: #5568d3;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.tags-list {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.tag-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.tag-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.tag-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.tag-info {
  flex: 1;
}

.tag-name {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.tag-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  border: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

.btn-delete {
  background: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn-delete:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.3);
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error {
  color: #e53e3e;
}

.empty {
  color: #666;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .tags-list {
    grid-template-columns: 1fr;
  }

  .tag-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .tag-actions {
    width: 100%;
  }

  .btn-delete {
    width: 100%;
  }
}
</style>
