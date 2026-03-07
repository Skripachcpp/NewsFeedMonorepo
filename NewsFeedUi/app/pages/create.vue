<template>
  <ClientOnly>
    <NewsCreate />
  </ClientOnly>
</template>

<script setup lang="ts">
const NewsCreate = defineAsyncComponent(() => import("news/NewsCreate"));
</script>
