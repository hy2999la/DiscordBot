import { REST, Routes } from 'discord.js';

(async () => {
  try {
    console.log('Updating command list');

    const rest = new REST({ version: '10' }).setToken(
      process.env.DISCORD_TOKEN
    );

    const res = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
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
          },
          {
            description: 'Start Rainbox 6 Siege lobby',
            name: 'r6'
          },
          {
            description: 'Start Valorant lobby',
            name: 'valorant'
          }
        ]
      }
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  }
})();
