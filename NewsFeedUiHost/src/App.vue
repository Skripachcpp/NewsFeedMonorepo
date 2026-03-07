<template>
  <router-view />
</template>

<script setup lang="ts"></script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
#app {
  isolation: isolate;
}
</style>
