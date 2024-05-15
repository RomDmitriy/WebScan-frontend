FROM node:20.13.1-slim

WORKDIR /app

# Копируем всё
COPY . .

# Устанавливаем зависимости
RUN npm ci

# Открываем порт
EXPOSE 8080

# Запускаем
CMD npm run dev