# syntax=docker/dockerfile:1
FROM node:18
WORKDIR /DiscordBot
COPY ["package*.json", "./"]
RUN npm install --production

COPY . .
CMD ["npm", "start"]
EXPOSE 3000
