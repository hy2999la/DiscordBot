import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import { buildLobbyMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder().setName('lobby-init-norms'),
  async execute(interaction) {
    const { member } = interaction;
    const lobby = await lobbyManager.createLobby({
      game: 'league',
      type: 'Norms',
      member
    });
    const message = buildLobbyMessage(lobby, member);
    try {
      await interaction.update({ components: [] });
    } catch (err) {
      console.error("league: Can't edit lobby options message");
    }
    const newInteraction = await interaction.followUp(message);
    lobby.setLobbyInteraction(newInteraction);
  }
};
