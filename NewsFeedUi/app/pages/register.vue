<template>
  <ClientOnly>
    <Register />
  </ClientOnly>
</template>

<script setup lang="ts">
const Register = defineAsyncComponent(() => import("auth/Register"));
</script>
