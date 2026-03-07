<template>
  <ClientOnly>
    <NewsList />
  </ClientOnly>
</template>

<script setup lang="ts">
const NewsList = defineAsyncComponent(() => import("news/NewsList"));
</script>
