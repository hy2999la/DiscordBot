import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import { buildStartingLobbyMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder().setName('lobby-start-apex'),
  async execute(interaction) {
    console.log('apex: Starting Lobby Prematurely');
    const lobby = lobbyManager.getLobbyInstance('apex');
    interaction.message.delete();
    await interaction.reply(buildStartingLobbyMessage(lobby));
    console.log('apex: Closing Lobby');
    lobbyManager.closeLobby(lobby);
  }
};
