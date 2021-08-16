import { getMentions, initLobby } from './src/commands/apex/lobby';
import { createStockMessageEmbed } from './src/commands/stocks';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types';

import { Client } from 'discord.js';
const client = new Client();

client.once('ready', () => {
	console.log('Bot is ready');
});

client.on('message', async (message) => {
	const startLobbyMentions = getMentions();
	if (message.mentions.roles.some(r => startLobbyMentions.indexOf(r.name) >= 0) || message.content === '!start') {
		const user = message.member;

		initLobby(message, user);

		return;
	}
	else if (message.content.startsWith('!stocks') || message.content.startsWith('!stock') || message.content.startsWith('!stonks') || message.content.startsWith('!stonk')) {
		const args = message.content.split(' ');

		const ticker = args[1];
		const tickerData = await createStockMessageEmbed(ticker);

		message.channel.send(tickerData);
	}
});

client.login(process.env.DISCORD_TOKEN);