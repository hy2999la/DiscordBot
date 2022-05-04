import { Client, Collection, Intents } from 'discord.js';

import commands from './src/commands/index.js';
import constants from './src/utils/constants.js';

const filterAllowedChannels = (interaction) => {
  const commandType = interaction.commandName.split('-')[0];
  return constants.ALLOWED_CHANNELS[process.env.ENVIRONMENT][
    commandType
  ]?.includes(interaction.channelId);
};

const intents = new Intents();
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({
  allowedMentions: { parse: ['users', 'roles'] },
  intents
});

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
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (!filterAllowedChannels(interaction)) {
      interaction.reply({
        content: 'This command is not allowed in this channel',
        ephemeral: true
      });
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
    }
  } else if (interaction.isButton()) {
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
});

client.login(process.env.DISCORD_TOKEN);
