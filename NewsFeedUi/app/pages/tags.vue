<template>
  <ClientOnly>
    <TagsPage />
  </ClientOnly>
</template>

<script setup lang="ts">
const TagsPage = defineAsyncComponent(() => import("news/TagsPage"));
</script>
