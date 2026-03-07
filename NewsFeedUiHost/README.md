# News Feed — Host (микрофронты, Vite + Module Federation)

Оболочка (shell): layout, роутер, конфиг; подгружает remotes **NewsFeedUiAuth** и **NewsFeedUiNews**.

- Порт в dev: **5000**
- Remotes: auth → http://localhost:5001, news → http://localhost:5002

## Запуск

1. Собрать shared: из корня монорепо  
   `npm run build --prefix packages/shared`

2. Установить зависимости:  
   `npm install`

3. Запуск (remotes должны быть уже запущены на 5001 и 5002):  
   `npm run dev`

Либо из **NewsFeedUi** одной командой:  
`npm run mf:dev`

## Конфиг

В `src/main.ts` вызывается `setConfig()` из `@news-feed/shared`. Переменные окружения:

- `VITE_API_BASE_URL` — основной API
- `VITE_AUTH_API_BASE_URL` — сервис авторизации
- `VITE_AUTH_TOKEN_COOKIE_NAME` — имя cookie с токеном
