import { SlashCommandBuilder } from 'discord.js';

import lobbyManager from '../../lobbyManager/index.js';
import gameJsons from '../../lobbyManager/lobbyConfigParser.js';
import {
  buildLobbyStartMessage,
  updateLobbyList
} from '../../lobbyManager/lobbyMessageBuilder.js';

const lobbyJoinLeaveCommands = gameJsons.map((gameJson) => {
  const { name } = gameJson;
  return {
    data: new SlashCommandBuilder().setName(`lobby-join-leave-${name}`),
    async execute(interaction, lobbyId) {
      const { member, message } = interaction;
      const { content } = message;

      if (lobbyManager.checkLobbyId(name, lobbyId)) {
        const lobby = lobbyManager.getLobby(name);
        if (lobby.containsUser(member)) {
          lobby.removeUser(member);
          await interaction.update(updateLobbyList(content, lobby));
        } else if (lobby.addUser(member)) {
          console.log(
            `${name}: Current Lobby is now full, pinging current lobby users`
          );
          interaction.message.delete();
          await interaction.reply(buildLobbyStartMessage(lobby, gameJson));
          console.log(`${name}: Closing Lobby`);
          lobbyManager.closeLobby(lobby);
        } else {
          await interaction.update(updateLobbyList(content, lobby));
        }
      } else {
        await interaction.update({
          components: [],
          content: 'Lobby is outdated'
        });
      }
    }
  };
});

export default lobbyJoinLeaveCommands;
