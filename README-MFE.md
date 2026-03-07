# News Feed — микрофронты (Nuxt + Vite Module Federation)

Микрофронты вынесены в отдельные проекты на уровень **NewsFeedUi** (в корне монорепо). Хост — приложение **NewsFeedUi** (Nuxt), подгружающее remotes в рантайме.

## Структура

| Проект        | Порт | Роль   | Содержимое |
|---------------|------|--------|------------|
| **NewsFeedUi**  | 5000 | Shell  | Nuxt: layout, роутер, конфиг; подгружает remotes |
| **NewsFeedUiAuth** | 5001 | Remote | Логин, регистрация |
| **NewsFeedUiNews** | 5002 | Remote | Новости, статья, создание/редактирование, теги |

Общая логика — пакет **@news-feed/shared** (`packages/shared`).

## Запуск в dev

1. Собрать shared (из корня монорепо):

   ```bash
   npm run build --prefix packages/shared
   ```

2. Установить зависимости (один раз):

   ```bash
   cd NewsFeedUiAuth && npm install
   cd ../NewsFeedUiNews && npm install
   cd ../NewsFeedUi && npm install
   ```

3. Запустить все три (из каталога **NewsFeedUi**):

   ```bash
   npm run mf:dev
   ```

   Или в трёх терминалах:

   ```bash
   npm run mf:dev:auth   # 5001
   npm run mf:dev:news   # 5002
   npm run mf:dev:host   # 5000 — Nuxt host
   ```

4. Открыть: **http://localhost:5000**

## Сборка для production

1. Собрать shared: `npm run build --prefix packages/shared`
2. Собрать remotes: в **NewsFeedUiAuth** и **NewsFeedUiNews** выполнить `npm run build`
3. Собрать host: в **NewsFeedUi** выполнить `npm run build`
4. Развернуть auth и news, подставить их URL в конфиг host: переменные окружения `NUXT_PUBLIC_AUTH_REMOTE_URL` и `NUXT_PUBLIC_NEWS_REMOTE_URL` (по умолчанию — localhost:5001, 5002).
