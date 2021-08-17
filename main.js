import lobbyCommand from './src/commands/apex/lobby.js';
import lobbyEmptyCommand from './src/commands/apex/lobbyempty.js';
import lobbyJoinLeaveButton from './src/commands/apex/lobby-join-leave.js';
// import { createStockMessageEmbed } from './src/commands/stocks/index.js';

import { Client, Collection, Intents } from 'discord.js';

const intents = new Intents();
intents.add(Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents });

client.commands = new Collection();
client.commands.set(lobbyCommand.data.name, lobbyCommand);
client.commands.set(lobbyEmptyCommand.data.name, lobbyEmptyCommand);
client.commands.set(lobbyJoinLeaveButton.data.name, lobbyJoinLeaveButton);

client.once('ready', () => {
	console.log('Bot is ready');
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, client);
		}
		catch (err) {
			console.error(err);
		}
	}
	else if (interaction.isButton()) {
		const command = client.commands.get(interaction.customId);

		if (!command) return;

		try {
			await command.execute(interaction);
		}
		catch (err) {
			console.error(err);
		}
	}
	else {
		return;
	}
});

// client.on('message', async (message) => {
// 	const startLobbyMentions = Lobby.getMentions();
// 	if (message.mentions.roles.some(r => startLobbyMentions.indexOf(r.name) >= 0) || message.content === '!start') {
// 		const user = message.member;

// 		Lobby.initLobby(message, user);

// 		return;
// 	}
// 	else if (message.content.startsWith('!stocks') || message.content.startsWith('!stock') || message.content.startsWith('!stonks') || message.content.startsWith('!stonk')) {
// 		const args = message.content.split(' ');

// 		const ticker = args[1];
// 		const tickerData = await createStockMessageEmbed(ticker);

// 		message.channel.send(tickerData);
// 	}
// });

client.login(process.env.DISCORD_TOKEN);