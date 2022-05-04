import { roleMention, userMention } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';

const buildLobbyList = (lobby) => {
  let i = 1;
  const lobbyList = Object.entries(lobby.users).map(
    (user) => `${i++}. ${user[1]}`
  );
  for (; i <= lobby.maxSize; i++) {
    lobbyList.push(`${i}. -Free-`);
  }
  return lobbyList.join('\n');
};

export const updateLobbyList = (message, lobby) => {
  const messageSplit = message.split('--');
  const messageHeader = messageSplit[0];
  const lobbyList = buildLobbyList(lobby);

  return `${messageHeader}--\n**${lobbyList}**`;
};

export const buildLobbyInitMessage = (lobby, gameJson) => {
  const { game, id, type } = lobby;
  let title;
  let roleIdMention;
  if (type) {
    const typeJson = gameJson.params.find((p) => p.name === type);
    title = `[**${gameJson.displayName}** / **${typeJson.displayName}**]`;
    roleIdMention = roleMention(typeJson.roleId);
  } else {
    title = `[**${gameJson.displayName}**]`;
    roleIdMention = roleMention(gameJson.params.roleId);
  }

  const message = `${roleIdMention}
Creating ${title} Lobby...
--
**${buildLobbyList(lobby)}**`;

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`lobby-join-leave-${game}:${id}`)
      .setLabel('Join/Leave')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(`lobby-start-${game}:${id}`)
      .setLabel('Start')
      .setStyle('SUCCESS')
  );
  return { components: [row], content: message };
};

export const buildLobbyTypeMessage = (types) => {
  const message = 'Which lobby would you like to start?';

  const row = new MessageActionRow().addComponents(
    types.map((type) =>
      new MessageButton()
        .setCustomId(type.name)
        .setLabel(type.displayName)
        .setStyle('PRIMARY')
    )
  );
  return { components: [row], content: message, ephemeral: true };
};

export const buildLobbyStartMessage = (lobby, gameJson) => {
  if (Object.keys(lobby.users).length === 0) {
    console.log(`${lobby.game}: Started empty lobby, closing...`);
    return { components: [], content: 'Closed empty lobby.' };
  }

  let startMessage = `[**${gameJson.displayName}**${
    lobby.type
      ? ` / **${
          gameJson.params.find((p) => p.name === lobby.type).displayName
        }**`
      : ''
  }] Game is starting GL!\n`;
  const fullUsers = Object.entries(lobby.users)
    .map((user) => userMention(user[0]))
    .join('\n');
  startMessage += `${fullUsers}`;
  return { components: [], content: startMessage };
};
