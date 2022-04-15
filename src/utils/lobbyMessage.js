import { roleMention, userMention } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';

import CONSTANTS from './constants.js';

export const updateLobbyList = (message, lobby) => {
  const messageSplit = message.split('--');
  const messageHeader = messageSplit[0];
  let i = 1;
  let lobbyList = Object.entries(lobby.users).map(
    (user) => `${i++}. ${user[1]}`
  );
  for (; i <= lobby.maxSize; i++) {
    lobbyList.push(`${i}. -Free-`);
  }

  return messageHeader + `--\n**` + lobbyList.join('\n') + '**';
};

export const buildLobbyMessage = (lobby, member) => {
  const CONSTANT = CONSTANTS[lobby.game];
  let message = CONSTANT.MESSAGE;
  if (lobby.type) {
    message = message.replace('{type}', lobby.type);
  }
  message = message.replace('{ROLE_ID}', roleMention(CONSTANT.ROLE_ID));
  message = message.replace('-Free-', member.nickname);

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`lobby-join-leave-${lobby.game}:${lobby.id}`)
      .setLabel('Join/Leave')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(`lobby-start-${lobby.game}:${lobby.id}`)
      .setLabel('Start')
      .setStyle('SUCCESS')
  );
  return { content: message, components: [row] };
};

export const buildLeagueLobbyInitMessage = () => {
  let message = CONSTANTS.league.OPTIONS_MESSAGE;

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`lobby-init-norms`)
      .setLabel('Norms')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(`lobby-init-aram`)
      .setLabel('ARAM')
      .setStyle('PRIMARY')
  );
  return { content: message, components: [row], ephemeral: true };
};

export const buildStartingLobbyMessage = (lobby) => {
  if (Object.keys(lobby.users).length === 0) {
    console.log(`${lobby.game}: Started empty lobby, closing...`);
    return { content: 'Closed empty lobby.', components: [] };
  }

  let startMessage = `[**${lobby.game}**${
    lobby.type ? ` / **${lobby.type}**` : ''
  }] Game is starting GL!\n`;
  const fullUsers = Object.entries(lobby.users)
    .map((user) => userMention(user[0]))
    .join('\n');
  startMessage += `${fullUsers}`;
  return { content: startMessage, components: [] };
};
