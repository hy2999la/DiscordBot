import { SlashCommandBuilder, roleMention } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';

import lobbyInstance from './lobbyHelper.js';
import constants from '../../utils/constants.js';
const { APEX, LOBBY } = constants;

export default {
	data: new SlashCommandBuilder()
		.setName('lobby')
		.setDescription('Create a lobby with you in it'),
	async execute(interaction) {
		if (LOBBY.ALLOWED_CHANNELS.includes(interaction.channelId)) {
			const { member } = interaction;

			const lobbyId = await lobbyInstance.initLobby(member, false);
			let message = APEX.MESSAGE;
			message = message.replace('{ROLE_ID}', roleMention(APEX.ROLE_ID));
			message = message.replace('-Free-', member.nickname);

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`join-leave:${lobbyId}`)
						.setLabel('Join/Leave')
						.setStyle('PRIMARY'),
				);

			// If this lobby was started from a button
			if (interaction.isButton()) {
				// Remove the create lobby buttons
				await interaction.update({ components: [] });
				await interaction.followUp({ content: message, components: [row] });
			}
			else {
				await interaction.reply({ content: message, components: [row] });
			}

			lobbyInstance.setLobbyInteraction(interaction);
		}
		else {
			await interaction.reply({ content: 'This channel can\'t start a lobby', ephemeral: true });
		}
	},
};