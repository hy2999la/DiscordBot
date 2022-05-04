import { Client, Collection, Intents } from 'discord.js';
import commands from './src/commands/index.js';
import constants from './src/utils/constants.js';

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
    ]?.includes(interaction.channelId);
  }

  return 1;
};

const intents = new Intents();
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({
  allowedMentions: { parse: ['users', 'roles'] },
  intents
});

client.commands = new Collection();
Object.entries(commands).forEach((command) => {
  client.commands.set(command[1].data.name, command[1]);
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
            try {
              await interaction.reply({
                content: 'Bot is currently in dev mode.',
                ephemeral: true
              });
            } catch (e) {
              console.log('prod bot responded');
            }
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
