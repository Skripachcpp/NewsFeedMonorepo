<template>
  <div class="layout">
    <header class="header">
      <div v-if="!authenticated" class="buttons">
        <router-link to="/login" class="btn btn-link">Войти</router-link>
        <router-link to="/register" class="btn btn-link">Зарегистрироваться</router-link>
      </div>
      <div v-else class="buttons">
        <span class="user-name">{{ userName }}</span>
        <button class="btn btn-link" type="button" @click="logout">Выйти</button>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { loadUserInfo, getStoredUserName, isAuthenticated, logout as doLogout } from "@news-feed/shared";

const router = useRouter();
const userName = ref<string | undefined>(getStoredUserName());
const authenticated = ref(false);

function refreshAuth() {
  authenticated.value = isAuthenticated();
  userName.value = getStoredUserName();
}

function logout() {
  doLogout();
  refreshAuth();
}

onMounted(async () => {
  if (isAuthenticated()) {
    await loadUserInfo();
  }
  refreshAuth();
});

router.afterEach(() => refreshAuth());
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background-color: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
}
.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.footer {
  background-color: #f7fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  text-align: center;
  color: #718096;
}
.user-name {
  color: #718096;
}
</style>

<style>
.error {
  gap: 12px;
  font-weight: 700;
  color: rgb(181, 20, 20);
}
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  display: inline-block;
  text-align: center;
}
.btn-blue {
  background: #3b82f6;
  color: white;
}
.btn-blue:hover {
  background: #2563eb;
}
.btn-red {
  background: #ef4444;
  color: white;
}
.btn-red:hover:not(:disabled) {
  background: #dc2626;
}
.btn-green {
  background: #10b981;
  color: white;
}
.btn-green:hover {
  background: #059669;
}
.btn-grey {
  background: #6b7280;
  color: white;
}
.btn-link {
  color: #667eea;
  padding: 0.5rem 0;
  background: none;
  font-weight: 600;
  text-decoration: none;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  margin-right: 42px;
}
</style>
