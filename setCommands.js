import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [
	{
		name: 'lobby',
		description: 'Create a lobby with you in it',
	},
	{
		name: 'lobbyempty',
		description: 'Create an empty lobby',
	},
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Updating command list:');
		console.log(commands);
		const res = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);
		console.log(res);
	}
	catch (err) {
		console.error(err);
	}
})();