import { REST, Routes } from 'discord.js';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

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
            description: 'Start Apex lobby',
            name: 'apex'
          },
          {
            description: 'Start Best Game lobby',
            name: 'bestgame'
          },
          {
            description: 'Start Overwatch lobby',
            name: 'ow'
          }
        ]
      }
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  }
})();
