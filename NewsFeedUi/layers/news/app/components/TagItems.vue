<template>
  <div v-if="tags?.length" class="news-tags">
    <div v-for="tag in tags" :key="tag">#{{ tag }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags?: string[];
}>();
</script>

<style scoped>
.news-tags {
  display: flex;
  gap: 2px 8px;
  color: rgb(99, 99, 218);
}
</style>
