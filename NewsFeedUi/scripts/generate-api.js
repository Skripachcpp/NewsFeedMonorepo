// генератор api

import { execSync } from "child_process";
import { readFileSync, writeFileSync, rmSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

let config = {
  url: "http://localhost:5058/swagger/v1/swagger.json",
  output: "app/api/generated",
  input: "swagger.json",
};

try {
  const configFile = join(rootDir, ".swaggerrc.json");
  const configData = readFileSync(configFile, "utf-8");
  config = { ...config, ...JSON.parse(configData) };
} catch (error) {
  // Конфиг не обязателен, используем значения по умолчанию
}

const SWAGGER_URL = process.env.SWAGGER_URL || config.url;
const SWAGGER_FILE = join(rootDir, config.input);
const OUTPUT_DIR = join(rootDir, config.output);

async function downloadSwagger(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    console.log(`📥 Загрузка Swagger спецификации с ${url}...`);

    client
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `Ошибка загрузки: ${res.statusCode} ${res.statusMessage}`,
            ),
          );
          return;
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            writeFileSync(SWAGGER_FILE, JSON.stringify(json, null, 2), "utf-8");
            console.log(`✅ Swagger файл сохранен: ${SWAGGER_FILE}`);
            resolve();
          } catch (error) {
            reject(new Error(`Ошибка парсинга JSON: ${error.message}`));
          }
        });
      })
      .on("error", (error) => {
        reject(new Error(`Ошибка загрузки: ${error.message}`));
      });
  });
}

function generateApi() {
  console.log(`🔧 Генерация API клиента из ${SWAGGER_FILE}...`);

  try {
    // Проверяем существование swagger.json
    if (!readFileSync(SWAGGER_FILE, "utf-8")) {
      throw new Error(`Файл ${SWAGGER_FILE} не найден или пуст`);
    }

    // Удаляем старую директорию для полной перегенерации
    if (existsSync(OUTPUT_DIR)) {
      console.log(`🗑️  Удаление старой директории ${OUTPUT_DIR}...`);
      rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }

    // Генерируем API клиент
    execSync(
      `npx openapi-typescript-codegen --input "${SWAGGER_FILE}" --output "${OUTPUT_DIR}" --client axios`,
      {
        stdio: "inherit",
        cwd: rootDir,
      },
    );

    // Исправляем проблему с form-data для браузерного окружения
    const requestFile = join(OUTPUT_DIR, "core", "request.ts");
    try {
      let requestContent = readFileSync(requestFile, "utf-8");

      // Удаляем импорт form-data (Node.js пакет)
      requestContent = requestContent.replace(
        /import FormData from 'form-data';\n/g,
        "",
      );

      // Исправляем использование getHeaders (метод Node.js form-data)
      requestContent = requestContent.replace(
        /const formHeaders = typeof formData\?\.getHeaders === 'function' && formData\?\.getHeaders\(\) \|\| \{\}/g,
        "// Браузерный FormData не имеет метода getHeaders, поэтому не добавляем заголовки\n    const formHeaders = {}",
      );

      writeFileSync(requestFile, requestContent, "utf-8");
      console.log(
        `✅ Исправлена проблема с form-data для браузерного окружения`,
      );
    } catch (fixError) {
      console.warn(
        `⚠️  Не удалось применить исправления к request.ts: ${fixError.message}`,
      );
    }

    console.log(`✅ API клиент успешно сгенерирован в ${OUTPUT_DIR}`);
  } catch (error) {
    console.error(`❌ Ошибка генерации API: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const useLocal =
    process.argv.includes("--local") || process.argv.includes("-l");

  try {
    // По умолчанию всегда загружаем swagger.json с сервера
    // Используйте флаг --local для использования локального файла
    if (useLocal) {
      console.log(
        `ℹ️  Используется локальный файл ${SWAGGER_FILE} (флаг --local)`,
      );
      if (!existsSync(SWAGGER_FILE)) {
        throw new Error(
          `Локальный файл ${SWAGGER_FILE} не найден. Убедитесь, что файл существует или запустите без флага --local для загрузки с сервера.`,
        );
      }
    } else {
      // Автоматически загружаем с сервера
      await downloadSwagger(SWAGGER_URL);
    }

    generateApi();
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    process.exit(1);
  }
}

main();
