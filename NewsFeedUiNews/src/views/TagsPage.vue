<template>
  <div class="tags-page">
    <div class="container">
      <div class="page-header">
        <router-link to="/" class="back-link">← Назад к списку новостей</router-link>
        <h1>Теги</h1>
      </div>
      <div v-if="pending" class="loading">
        <p>Загрузка тегов...</p>
      </div>
      <div v-else-if="error || deleteError" class="error">
        <p>{{ error || deleteError }}</p>
        <button type="button" class="btn btn-secondary" @click="loadTags">Попробовать снова</button>
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
                type="button"
                class="btn btn-delete"
                :disabled="deletingId === tag.id"
                @click="setTagToDelete({ id: tag.id ?? -1, name: tag.name ?? '' })"
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
import { ref, computed, onMounted } from "vue";
import { errorToString } from "@news-feed/shared";
import { api } from "../api";
import type { TagDto } from "@news-feed/shared";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.vue";
import { useDeleteTags } from "../composables/useDeleteTags";

const tags = ref<TagDto[]>([]);
const pending = ref(true);
const loadError = ref<unknown>(null);

async function loadTags() {
  pending.value = true;
  loadError.value = null;
  try {
    tags.value = await api.getTags();
  } catch (e) {
    loadError.value = e;
  } finally {
    pending.value = false;
  }
}

const error = computed(() => errorToString(loadError.value));
const { deletingId, deleteError, tagToDelete, confirmDelete } = useDeleteTags(tags);

function setTagToDelete(tag: { id: number; name: string } | undefined) {
  tagToDelete.value = tag;
}

onMounted(loadTags);
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
  color: #667eea;
  font-weight: 500;
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
}
.tag-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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
.btn-delete {
  background: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
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
</style>
