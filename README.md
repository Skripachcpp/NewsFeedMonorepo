# NewsFeed Monorepo

Монорепозиторий для проекта NewsFeed, включающий API, сервис аутентификации и веб-интерфейс.

## Структура проекта

- **NewsFeedApi** - Основной API для работы с новостями (ASP.NET Core)
- **NewsFeedAuthService** - Микросервис аутентификации и авторизации (ASP.NET Core)
- **NewsFeedUi** - Веб-интерфейс на Nuxt.js

## Требования

- Docker Desktop (или Docker Engine + Docker Compose)
- Git (для клонирования репозитория)

## Быстрый старт

### 1. Клонирование репозитория

Если вы клонируете основной репозиторий, не забудьте инициализировать субмодули:

```bash
git clone --recurse-submodules git@github.com:Skripachcpp/NewsFeedMonorepo.git
```

Или если репозиторий уже склонирован:

```bash
git submodule update --init --recursive
```

### 2. Запуск всех сервисов

Запустите все сервисы одной командой:

```bash
docker-compose up -d
```

Эта команда:
- Соберет Docker образы для всех сервисов
- Запустит PostgreSQL базы данных
- Запустит Auth Service
- Запустит NewsFeed API
- Запустит веб-интерфейс

### 3. Проверка статуса

Проверьте, что все контейнеры запущены:

```bash
docker-compose ps
```

Все контейнеры должны быть в статусе `Up` и `healthy` (для PostgreSQL).

### 4. Доступ к сервисам

После запуска сервисы будут доступны по следующим адресам:

- **Веб-интерфейс**: http://localhost:3000
- **NewsFeed API**: http://localhost:5058
- **Auth Service**: http://localhost:5000
- **PostgreSQL (NewsFeed)**: localhost:5432
- **PostgreSQL (Auth)**: localhost:5433

## Полезные команды

### Просмотр логов

Просмотр логов всех сервисов:
```bash
docker-compose logs -f
```

Логи конкретного сервиса:
```bash
docker-compose logs -f newsfeed-api
docker-compose logs -f newsfeed-auth-service
docker-compose logs -f newsfeed-ui
```

### Остановка сервисов

Остановить все сервисы:
```bash
docker-compose down
```

Остановить и удалить volumes (базы данных будут удалены):
```bash
docker-compose down -v
```

### Пересборка образов

Если вы внесли изменения в код и нужно пересобрать образы:

```bash
docker-compose build
docker-compose up -d
```

Или одной командой:
```bash
docker-compose up -d --build
```

### Перезапуск конкретного сервиса

```bash
docker-compose restart newsfeed-api
docker-compose restart newsfeed-auth-service
docker-compose restart newsfeed-ui
```

## Конфигурация

### Переменные окружения

Основные настройки можно изменить в файле `docker-compose.yml`:

- **Базы данных**: пароли и имена баз данных
- **JWT настройки**: секретный ключ, issuer, audience
- **Порты**: можно изменить порты для доступа к сервисам

### Базы данных

По умолчанию используются следующие настройки:

**PostgreSQL для NewsFeed API:**
- Порт: 5432
- База данных: NewsFeed
- Пользователь: postgres
- Пароль: password

**PostgreSQL для Auth Service:**
- Порт: 5433
- База данных: NewsFeedAuth
- Пользователь: postgres
- Пароль: password

⚠️ **Внимание**: В продакшене обязательно измените пароли и используйте секретные ключи!

## Разработка

### Запуск отдельных сервисов

Если нужно запустить только определенные сервисы:

```bash
# Только базы данных
docker-compose up -d postgres postgres-auth

# Только API
docker-compose up -d newsfeed-api

# Только UI
docker-compose up -d newsfeed-ui
```

### Миграции базы данных

Миграции нужно выполнять вручную. Подключитесь к контейнеру и выполните миграции:

```bash
# Для NewsFeed API
docker-compose exec newsfeed-api dotnet ef database update --project /src/Infrastructure

# Для Auth Service
docker-compose exec newsfeed-auth-service dotnet ef database update --project /src/Infrastructure
```

## Устранение неполадок

### Проблемы с портами

Если порты уже заняты, измените их в `docker-compose.yml`:

```yaml
ports:
  - "НОВЫЙ_ПОРТ:8080"  # для API
  - "НОВЫЙ_ПОРТ:8080"  # для Auth Service
  - "НОВЫЙ_ПОРТ:3000"  # для UI
```

### Проблемы с базой данных

Если база данных не запускается, проверьте логи:

```bash
docker-compose logs postgres
docker-compose logs postgres-auth
```

### Очистка и перезапуск

Полная очистка и перезапуск:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Структура субмодулей

Проект использует Git субмодули:

- `NewsFeedApi` - https://github.com/Skripachcpp/NewsFeedApi
- `NewsFeedAuthService` - https://github.com/Skripachcpp/NewsFeedAuthService
- `NewsFeedUi` - https://github.com/Skripachcpp/NewsFeedUi

Для обновления субмодулей до последних версий:

```bash
git submodule update --remote
```

## Лицензия

[Укажите лицензию, если необходимо]


тестовый коммит
