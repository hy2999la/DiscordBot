import { Client, Collection, GatewayIntentBits } from 'discord.js';

import commands from '@/commands/index.js';
import constants from '@/utils/constants.js';

const filterAllowedChannels = (interaction) => {
  if (process.env.ENVIRONMENT === 'dev') {
    return constants.ALLOWED_CHANNELS.dev === interaction.channelId ? 1 : -1;
  }
  if (constants.ALLOWED_CHANNELS.dev === interaction.channelId) {
    return -2;
  }

  if (interaction.type === 'APPLICATION_COMMAND') {
    const commandType = interaction.commandName.split('-')[0];
    return constants.ALLOWED_CHANNELS[process.env.ENVIRONMENT][
      commandType
    ]?.includes(interaction.channelId)
      ? 1
      : 0;
  }

  return 1;
};

const clientOptions = {
  allowedMentions: { parse: ['users', 'roles'] },
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
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

client.once('ready', () => {
  console.log('Bot is ready');
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      switch (filterAllowedChannels(interaction)) {
        case 0:
          interaction.reply({
            content: 'This command is not allowed in this channel',
            ephemeral: true
          });
          return;
        case -1:
          setTimeout(async () => {
            interaction
              .reply({
                content: 'Bot is currently in dev mode.',
                ephemeral: true
              })
              .catch(() => {});
          }, 1000);
          return;
        case -2:
          return;
        default:
          break;
      }

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isButton()) {
      if (filterAllowedChannels(interaction) !== 1) return;

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
