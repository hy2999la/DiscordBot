import { SlashCommandBuilder, userMention } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';

import lobbyInstance from './lobbyHelper.js';

export default {
	data: new SlashCommandBuilder()
		.setName('join-leave')
		.setDescription('Join or leave a lobby'),
	async execute(interaction, lobbyId) {
		const { member, message } = interaction;
		const { content } = message;

		if (lobbyInstance.checkLobbyId(lobbyId)) {
			if (lobbyInstance.containsUser(member)) {
				lobbyInstance.removeUser(member);
				interaction.update(content.replace(member.nickname, '-Free-'));
			}
			else
			if (lobbyInstance.addUser(member)) {
				console.log('Current Lobby is now full, pinging current lobby users');
				let startMessage = 'Game is starting: ';
				for (const lobbyUser in lobbyInstance.lobbyUsers) {
					startMessage += `${userMention(lobbyInstance.lobbyUsers[lobbyUser])} /`;
				}
				startMessage = startMessage.slice(0, -2);
				startMessage += '. GL';

				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('lobby')
							.setLabel('Create lobby with me')
							.setStyle('PRIMARY'),
						new MessageButton()
							.setCustomId('lobbyempty')
							.setLabel('Create Empty Lobby')
							.setStyle('SECONDARY'),
					);
				await interaction.update({ content: startMessage, components: [row] });
				lobbyInstance.clearLobby();
			}
			else {
				interaction.update(content.replace('-Free-', member.nickname));
			}
		}
		else {
			interaction.update({ content: 'Lobby is outdated', components: [] });
		}
	},
};