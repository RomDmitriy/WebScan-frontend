FROM node:20.13.1-slim

WORKDIR /app

# Копируем всё
COPY . .

# Устанавливаем зависимости
RUN npm ci

# Компилируем
RUN npm run build

# Запускаем
CMD npm start