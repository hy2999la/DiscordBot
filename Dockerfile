# syntax=docker/dockerfile:1
FROM node:18
WORKDIR /DiscordBot
COPY ["package.json", "yarn.lock", "./"]
RUN yarn --production

COPY . .
CMD ["node", "main.js"]
