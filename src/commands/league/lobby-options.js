import { SlashCommandBuilder } from '@discordjs/builders';

import { buildLeagueLobbyInitMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('bestgame')
    .setDescription('Best game only'),
  async execute(interaction) {
    const message = buildLeagueLobbyInitMessage();
    await interaction.reply(message);
  }
};
