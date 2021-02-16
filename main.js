require('dotenv').config();

const Lobby = require('./src/lobby');

const Discord = require('discord.js');
const client = new Discord.Client();

let lobby;

/// Client

client.once('ready', () => {
  console.log('Bot is ready');
  lobby = new Lobby();
});

client.on('message', async (message) => {
  const mentions = Lobby.getMentions();
  if (message.mentions.roles.some(r => mentions.indexOf(r.name) >= 0) || message.content === '!start') {
    const user = message.member;

    lobby.initLobby(message, user);
  }
});

client.login(process.env.DISCORD_TOKEN);