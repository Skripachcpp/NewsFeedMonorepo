-- Скрипт для генерации миллиона тестовых новостей в базе данных NewsFeed
-- Выполнить: psql -h localhost -p 5432 -U postgres -d NewsFeed -f generate_test_news.sql
-- Или: PGPASSWORD=password psql -h localhost -p 5432 -U postgres -d NewsFeed -f generate_test_news.sql

-- Настройки для ускорения вставки
SET synchronous_commit = OFF;
SET maintenance_work_mem = '256MB';

BEGIN;

-- Создаем временную функцию для генерации случайного текста
CREATE OR REPLACE FUNCTION generate_random_text(length INTEGER) RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Генерируем миллион новостей батчами по 10000 для лучшей производительности
DO $$
DECLARE
    batch_size INTEGER := 10000;
    total_records INTEGER := 1000000;
    current_batch INTEGER := 0;
    i INTEGER;
    start_num INTEGER;
BEGIN
    RAISE NOTICE 'Начало генерации % новостей...', total_records;
    
    FOR i IN 1..(total_records / batch_size) LOOP
        start_num := (i - 1) * batch_size + 1;
        
        INSERT INTO news_article (title, content, summary, publication_date, user_id, user_name)
        SELECT 
            'Тестовая новость #' || (start_num + series - 1) AS title,
            'Это тестовое содержание новости номер ' || (start_num + series - 1) || '. ' || 
            'В этой новости содержится важная информация о различных событиях и происшествиях. ' ||
            'Мы продолжаем следить за развитием ситуации и будем информировать вас о всех обновлениях. ' ||
            'Дополнительные детали будут опубликованы по мере поступления новой информации. ' ||
            'Статья содержит подробный анализ текущей ситуации и возможных последствий.' AS content,
            'Краткое описание новости номер ' || (start_num + series - 1) || '. ' || 
            'Это краткое резюме основных моментов статьи.' AS summary,
            NOW() - (random() * INTERVAL '365 days') AS publication_date,
            CASE WHEN random() > 0.3 THEN (random() * 1000)::INTEGER ELSE NULL END AS user_id,
            CASE WHEN random() > 0.3 THEN 'Пользователь_' || (random() * 1000)::INTEGER ELSE NULL END AS user_name
        FROM generate_series(1, batch_size) AS series;
        
        IF i % 10 = 0 THEN
            RAISE NOTICE 'Обработано % записей из %', (i * batch_size), total_records;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Генерация завершена!';
END $$;

-- Удаляем временную функцию
DROP FUNCTION IF EXISTS generate_random_text(INTEGER);

COMMIT;

-- Восстанавливаем настройки
RESET synchronous_commit;
RESET maintenance_work_mem;

-- Показываем статистику
SELECT COUNT(*) as total_news FROM news_article;
SELECT MIN(publication_date) as earliest_date, MAX(publication_date) as latest_date FROM news_article;

