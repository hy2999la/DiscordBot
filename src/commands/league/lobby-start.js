import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import { buildStartingLobbyMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder().setName('lobby-start-league'),
  async execute(interaction) {
    console.log('league: Starting Lobby Prematurely');
    const lobby = lobbyManager.getLobbyInstance('league');
    interaction.message.delete();
    await interaction.reply(buildStartingLobbyMessage(lobby));
    console.log('league: Closing Lobby');
    lobbyManager.closeLobby(lobby);
  }
};
