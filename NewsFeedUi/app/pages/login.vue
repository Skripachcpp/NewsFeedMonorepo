<template>
  <ClientOnly>
    <Login />
  </ClientOnly>
</template>

<script setup lang="ts">
const Login = defineAsyncComponent(() => import("auth/Login"));
</script>
