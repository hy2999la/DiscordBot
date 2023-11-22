import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

import commands from './src/commands/index.js';
import constants from './src/utils/constants.js';

/**
 *
 * @param {import('discord.js').Interaction} interaction
 * @returns
 */
const filterAllowedChannels = (interaction) => {
  if (process.env.ENVIRONMENT === 'dev') {
    return constants.ALLOWED_CHANNELS.dev === interaction.channelId ? 0 : -1;
  }

  if (constants.ALLOWED_CHANNELS.dev === interaction.channelId) {
    return -2;
  }

  if (interaction.isChatInputCommand()) {
    const commandType = interaction.commandName.split('-')[0];

    return constants.ALLOWED_CHANNELS[process.env.ENVIRONMENT][
      commandType
    ]?.includes(interaction.channelId)
      ? 0
      : 1;
  }

  return 0;
};

const clientOptions = {
  allowedMentions: { parse: ['users', 'roles'] },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
};

if (process.env.ENVIRONMENT === 'dev') {
  clientOptions.presence = {
    status: 'invisible'
  };
}
const client = new Client(clientOptions);

client.commands = new Collection();
Object.entries(commands).forEach((command) => {
  command[1].forEach((c) => {
    client.commands.set(c.data.name, c);
  });
});

client.once('ready', (c) => {
  console.log('Bot is ready');
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      switch (filterAllowedChannels(interaction)) {
        case 0:
          break;
        case 1:
          interaction.reply({
            content: 'This command is not allowed in this channel',
            ephemeral: true
          });
          return;
        case -1:
        case -2:
          return;
      }

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isButton()) {
      if (filterAllowedChannels(interaction) !== 0) return;

      const id = interaction.customId.split(':');
      const name = id[0];

      const command = client.commands.get(name);

      if (!command) return;

      try {
        if (id.length > 1) {
          const lobbyId = id[1];
          await command.execute(interaction, lobbyId);
        } else {
          await command.execute(interaction);
        }
      } catch (err) {
        console.error(err);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(process.env.DISCORD_TOKEN);
