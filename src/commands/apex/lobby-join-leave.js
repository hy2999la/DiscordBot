import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyInstance from './lobbyHelper.js';

export default {
	data: new SlashCommandBuilder()
		.setName('join-leave')
		.setDescription('Join or leave a lobby'),
	async execute(interaction) {
		const { member, message } = interaction;
		const { content } = message;

		if (lobbyInstance.containsUser(member)) {
			lobbyInstance.removeUser(member);
			interaction.update(content.replace(member.nickname, '-Free-'));
		}
		else {
			lobbyInstance.addUser(member);
			interaction.update(content.replace('-Free-', member.nickname));
		}
	},
};