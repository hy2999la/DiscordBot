import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction, Message, MessageActionRow, MessageButton } from 'discord.js';

import lobbyInstance from './lobbyHelper.js';

export default {
	data: new SlashCommandBuilder()
		.setName('lobby')
		.setDescription('Create a lobby with you in it'),
	channel: '808576788791427092',
	async execute(interaction, client) {
		const { member } = interaction;

		lobbyInstance.initLobby(member, false);
		const message =
`Creating Lobby...
**
1. ${member.nickname}
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