# syntax=docker/dockerfile:1
FROM node:18
WORKDIR /DiscordBot
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD ["node", "main.js"]
EXPOSE 3000
