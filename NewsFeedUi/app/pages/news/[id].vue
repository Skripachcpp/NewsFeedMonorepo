<template>
  <ClientOnly>
    <NewsDetail />
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.params.id as string,
});
const NewsDetail = defineAsyncComponent(() => import("news/NewsDetail"));
</script>
