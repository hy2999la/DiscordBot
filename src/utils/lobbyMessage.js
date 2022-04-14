import { roleMention, userMention } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';

import CONSTANTS from './constants.js';

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

export const buildFullLobbyMessage = (lobby) => {
  if (lobby.users.size === 0) {
    console.log(`${lobby.game}: Started empty lobby, closing...`);
    return { content: 'Closed empty lobby.', components: [] };
  }

  let startMessage = `Game [${lobby.game}${
    lobby.type ? ` / ${lobby.type}` : ''
  }] is starting:\n`;
  const fullUsers = Array.from(lobby.users)
    .map((user) => userMention(user))
    .join('\n');
  startMessage += `${fullUsers}\n\n GL!`;
  return { content: startMessage, components: [] };
};
