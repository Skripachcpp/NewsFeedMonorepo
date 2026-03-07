# News Feed — микрофронты (Vite + Module Federation)

Микрофронты вынесены в отдельные проекты на уровень **NewsFeedUi** (в корне монорепо).

## Структура

| Проект           | Порт | Роль   | Содержимое |
|------------------|------|--------|------------|
| **NewsFeedUiHost** | 5000 | Shell  | Layout, роутер, конфиг; подгружает remotes |
| **NewsFeedUiAuth** | 5001 | Remote | Логин, регистрация |
| **NewsFeedUiNews** | 5002 | Remote | Новости, статья, создание/редактирование, теги |

Общая логика — пакет **@news-feed/shared** (`packages/shared`).

## Запуск в dev

1. Собрать shared (из корня монорепо):

   ```bash
   npm run build --prefix packages/shared
   ```

2. Установить зависимости в каждом проекте (один раз):

   ```bash
   cd NewsFeedUiAuth && npm install
   cd ../NewsFeedUiNews && npm install
   cd ../NewsFeedUiHost && npm install
   ```

3. Запустить все три (из каталога **NewsFeedUi**):

   ```bash
   npm run mf:dev
   ```

   Или в трёх терминалах:

   ```bash
   npm run mf:dev:auth   # 5001
   npm run mf:dev:news   # 5002
   npm run mf:dev:host   # 5000
   ```

4. Открыть: **http://localhost:5000**

## Сборка для production

1. Собрать shared: `npm run build --prefix packages/shared`
2. Собрать remotes: в **NewsFeedUiAuth** и **NewsFeedUiNews** выполнить `npm run build`
3. Собрать host: в **NewsFeedUiHost** выполнить `npm run build`
4. Развернуть auth и news, подставить их URL в конфиг host (сейчас в `vite.config.ts` — localhost:5001, 5002).
