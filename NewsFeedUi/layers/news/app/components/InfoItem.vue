<template>
  <div v-if="value != null" class="info-item">
    <span v-if="label != null" class="info-label">{{ label }}:</span>
    <span class="info-value">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  value?: string | number | null;
}>();
</script>

<style scoped>
.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-label {
  color: #888;
  font-weight: 500;
}

.info-value {
  color: #555;
}
</style>
