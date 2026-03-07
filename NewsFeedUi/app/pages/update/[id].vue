<template>
  <ClientOnly>
    <NewsUpdate />
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.params.id as string,
});
const NewsUpdate = defineAsyncComponent(() => import("news/NewsUpdate"));
</script>
