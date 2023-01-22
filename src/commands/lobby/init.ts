import { SlashCommandBuilder } from 'discord.js';

import lobbyManager from '../../lobbyManager/index.js';
import lobbyConfigParser from '../../lobbyManager/lobbyConfigParser.js';
import {
  buildLobbyInitMessage,
  buildLobbyTypeMessage
} from '../../lobbyManager/lobbyMessageBuilder.js';

const lobbyInitCommands = await lobbyConfigParser().then((lobbyConfigs) =>
  lobbyConfigs.flatMap((lobbyConfig) => {
    const { command, description, name, params } = lobbyConfig;
    if (Array.isArray(params)) {
      const inits = [
        {
          data: new SlashCommandBuilder()
            .setName(command)
            .setDescription(description),
          async execute(interaction) {
            const message = buildLobbyTypeMessage(params);
            await interaction.reply(message);
          }
        }
      ];
      return [
        ...inits,
        ...params.map((param) => ({
          data: new SlashCommandBuilder()
            .setName(param.name)
            .setDescription(`Create ${param.name} lobby`),
          async execute(interaction) {
            const { member } = interaction;
            const lobby = await lobbyManager.createLobby({
              game: name,
              maxSize: param.size,
              member,
              type: param.name
            });
            const message = buildLobbyInitMessage(lobby, lobbyConfig);
            if (interaction.component) {
              await interaction.update({ components: [] });
              interaction.followUp(message);
            } else {
              interaction.reply(message);
            }
          }
        }))
      ];
    }

    return {
      data: new SlashCommandBuilder()
        .setName(command)
        .setDescription(`Create ${name} lobby`),
      async execute(interaction) {
        const { member } = interaction;
        const lobby = await lobbyManager.createLobby({
          game: name,
          maxSize: params.size,
          member
        });
        const message = buildLobbyInitMessage(lobby, lobbyConfig);
        await interaction.reply(message);
      }
    };
  })
);

export default lobbyInitCommands;
