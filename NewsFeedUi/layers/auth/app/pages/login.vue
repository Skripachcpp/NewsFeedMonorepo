<template>
  <div class="login-page">
    <div class="container">
      <h1>Вход в систему</h1>

      <div class="form">
        <div class="form-group">
          <label for="username" class="form-label">Имя пользователя</label>
          <input
            id="username"
            v-model="form.username"
            name="username"
            type="text"
            required
            class="form-input"
            placeholder="Введите имя пользователя"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            required
            class="form-input"
            placeholder="Введите пароль"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary"
            @click.prevent="handlerLogin"
          >
            <span v-if="loading">Вход...</span>
            <span v-else>Войти</span>
          </button>
        </div>

        <div class="register-link">
          <span>Нет аккаунта?</span>
          <NuxtLink to="/register" class="link">Зарегистрироваться</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/api/useAuth";
import { errorToString } from "~/utils/error";

definePageMeta({
  layout: false,
});

const { login, isAuthenticated } = useAuth();
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const error = ref<string>();
const loading = ref(false);

if (isAuthenticated.value) {
  router.push("/");
}

const handlerLogin = async () => {
  error.value = "";
  loading.value = true;

  await login(form.username, form.password)
    .then(() => {
      router.push("/");
    })
    .catch((err) => {
      error.value = errorToString(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.login-page {
  padding: 2rem;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  margin-top: 1rem;
}

.register-link .link {
  color: #667eea;
  font-weight: 600;
  margin-left: 0.5rem;
  text-decoration: none;
}

.register-link .link:hover {
  color: #5568d3;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
