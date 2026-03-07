### Запустите все сервисы одной командой:

```bash
docker-compose up -d --build
```

### Доступ к сервисам

После запуска сервисы будут доступны по следующим адресам:

- **Веб-интерфейс**: http://localhost:3000
- **NewsFeed API**: http://localhost:5058/swagger
- **Auth Service**: http://localhost:5164/swagger
- **PostgreSQL (NewsFeed)**: localhost:5432
- **PostgreSQL (Auth)**: localhost:5433

## Структура репозитория

Всё хранится в одном репозитории (монорепо), отдельные субмодули не используются. Коммиты делаются только на верхнем уровне.

- `NewsFeedApi` — API новостей и тегов
- `NewsFeedAuthService` — сервис авторизации
- `NewsFeedUi` — веб-интерфейс (Nuxt)
- `packages/shared` — общий код для UI
- `NewsFeedUiHost`, `NewsFeedUiAuth`, `NewsFeedUiNews` — микрофронты (Vite + Module Federation), см. README-MFE.md

## Генерация классов api в NewsFeedUi

npm run api
