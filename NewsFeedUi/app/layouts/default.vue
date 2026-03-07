<template>
  <div class="layout">
    <header class="header">
      <div v-if="!isAuthenticated" class="buttons">
        <NuxtLink to="login" class="btn btn-link">Войти</NuxtLink>
        <NuxtLink to="register" class="btn btn-link">Зарегистрироваться</NuxtLink>
      </div>
      <div v-else class="buttons">
        <div class="user-name">{{ userName }}</div>
        <button class="btn btn-link" @click="logout">Выйти</button>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/api/useAuth";
const { isAuthenticated, userName, logout, loadUserInfo } = useAuth();
if (unref(isAuthenticated)) loadUserInfo();
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-red {
  background: #ef4444;
  color: white;
}

.btn-red:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-red:disabled {
  background: #fca5a5;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-green {
  background: #10b981;
  color: white;
}

.btn-green:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
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
