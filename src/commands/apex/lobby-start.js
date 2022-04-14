import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import { buildFullLobbyMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder().setName('lobby-start-apex'),
  async execute(interaction) {
    console.log('apex: Starting Lobby Prematurely');
    const lobby = lobbyManager.getLobbyInstance('apex');
    await interaction.update(buildFullLobbyMessage(lobby));
    console.log('apex: Closing Lobby');
    lobbyManager.closeLobby(lobby);
  }
};
