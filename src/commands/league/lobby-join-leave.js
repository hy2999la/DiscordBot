import { SlashCommandBuilder } from '@discordjs/builders';

import lobbyManager from '../../lobbyManager/index.js';
import { buildFullLobbyMessage } from '../../utils/lobbyMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lobby-join-leave-league')
    .setDescription('Join or leave a lobby'),
  async execute(interaction, lobbyId) {
    const { member, message } = interaction;
    const { content } = message;

    if (lobbyManager.checkLobbyId('league', lobbyId)) {
      const lobby = lobbyManager.getLobbyInstance('league');
      if (lobby.containsUser(member)) {
        lobby.removeUser(member);
        interaction.update(content.replace(member.nickname, '-Free-'));
      } else if (lobby.addUser(member)) {
        console.log(
          'league: Current Lobby is now full, pinging current lobby users'
        );
        await interaction.update(buildFullLobbyMessage(lobby));
        console.log('league: Closing Lobby');
        lobbyManager.closeLobby(lobby);
      } else {
        interaction.update(content.replace('-Free-', member.nickname));
      }
    } else {
      interaction.update({ content: 'Lobby is outdated', components: [] });
    }
  }
};
