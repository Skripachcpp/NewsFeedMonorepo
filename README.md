Запустите все сервисы одной командой:

```bash
docker-compose up -d --build
```

### 4. Доступ к сервисам

После запуска сервисы будут доступны по следующим адресам:

- **Веб-интерфейс**: http://localhost:3000
- **NewsFeed API**: http://localhost:5058/swagger
- **Auth Service**: http://localhost:5164/swagger
- **PostgreSQL (NewsFeed)**: localhost:5432
- **PostgreSQL (Auth)**: localhost:5433

## Структура субмодулей

Проект использует Git субмодули:

- `NewsFeedApi` - https://github.com/Skripachcpp/NewsFeedApi
- `NewsFeedAuthService` - https://github.com/Skripachcpp/NewsFeedAuthService
- `NewsFeedUi` - https://github.com/Skripachcpp/NewsFeedUi
