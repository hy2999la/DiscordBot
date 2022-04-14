import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Updating command list');
    const res = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: [
          {
            name: 'apex',
            description: 'Start apex lobby'
          },
          {
            name: 'bestgame',
            description: 'Start best game lobby'
          }
        ]
      }
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  }
})();
