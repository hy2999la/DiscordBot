import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import { buildLobbyMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('apex')
    .setDescription('Create an apex lobby'),
  async execute(interaction) {
    console.log('apex: Starting Lobby');
    const { member } = interaction;
    const lobby = await lobbyManager.createLobby({
      game: 'apex',
      member
    });
    const message = buildLobbyMessage(lobby, member);
    await interaction.reply(message);
    lobby.setLobbyInteraction(interaction);
  }
};
