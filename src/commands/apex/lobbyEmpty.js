import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

import lobbyInstance from './lobbyHelper.js';

export default {
	data: new SlashCommandBuilder()
		.setName('lobbyempty')
		.setDescription('Create an empty lobby'),
	channel: '808576788791427092',
	async execute(interaction, client) {
		const { member } = interaction;

		lobbyInstance.initLobby(member, true);
		const message =
`Creating Lobby...
**
1. -Free-
2. -Free-
3. -Free-
**
`;

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('join-leave')
					.setLabel('Join/Leave')
					.setStyle('PRIMARY'),
			);

		await interaction.reply({ content: message, components: [row] });
		lobbyInstance.setLobbyInteraction(interaction);
	},
};