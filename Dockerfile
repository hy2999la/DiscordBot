# syntax=docker/dockerfile:1
FROM node:20
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD ["node", "main.js"]
