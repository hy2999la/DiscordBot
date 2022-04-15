import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import {
  buildStartingLobbyMessage,
  updateLobbyList
} from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lobby-join-leave-apex')
    .setDescription('Join or leave a lobby'),
  async execute(interaction, lobbyId) {
    const { member, message } = interaction;
    const { content } = message;

    if (lobbyManager.checkLobbyId('apex', lobbyId)) {
      const lobby = lobbyManager.getLobbyInstance('apex');
      if (lobby.containsUser(member)) {
        lobby.removeUser(member);
        await interaction.update(updateLobbyList(content, lobby));
      } else if (lobby.addUser(member)) {
        console.log(
          'apex: Current Lobby is now full, pinging current lobby users'
        );
        await interaction.update(buildStartingLobbyMessage(lobby));
        console.log('apex: Closing Lobby');
        lobbyManager.closeLobby(lobby);
      } else {
        await interaction.update(updateLobbyList(content, lobby));
      }
    } else {
      await interaction.update({
        content: 'Lobby is outdated',
        components: []
      });
    }
  }
};
