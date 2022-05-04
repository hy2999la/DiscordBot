import { SlashCommandBuilder } from '@discordjs/builders';

import games from './helper/gamesParser.js';
import { buildLobbyStartMessage } from './helper/lobbyMessageBuilder.js';
import lobbyManager from './lobbyManager/index.js';

const lobbyEarlyStartCommands = games.map((game) => {
  const { name } = game;
  return {
    data: new SlashCommandBuilder().setName(`lobby-start-${name}`),
    async execute(interaction) {
      console.log(`${name}: Starting Lobby Prematurely`);
      const lobby = lobbyManager.getLobby(name);
      interaction.message.delete();
      await interaction.reply(buildLobbyStartMessage(lobby, game));
      console.log(`${name}: Closing Lobby`);
      lobbyManager.closeLobby(lobby);
    }
  };
});

export default lobbyEarlyStartCommands;
