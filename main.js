require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

let cachedLobbies = {};
let collector;

const filter = (reaction) => reaction.emoji.name === '👍'

/*
{
  [message.user.id]: [lobbyMessage]
}
*/

client.once('ready', () => {
  console.log('Bot is ready');
  cachedLobbies = {};
});

client.on('message', async (message) => {
  if (message.mentions.roles.some(r => r.name === "apex-test")) {
    const user = message.member;
    const lobbyMessage = await message.channel.send(
      `Creating a Lobby...\n1. ${user.displayName}\n2. Free \n3. Free\nReact to join this lobby`
    );

    await lobbyMessage.react('👍');

    collector = lobbyMessage.createReactionCollector(filter, { max: 3 });

    collector.on('collect', (r, user) => {
      const msg = r.message.toString();
      const foundGuildMember = message.guild.member(user);
      if (msg.indexOf(foundGuildMember.displayName)) {
        console.log(`Adding ${foundGuildMember.displayName} to current lobby`);

        const newMsg = msg.replace('Free', foundGuildMember.displayName);
        lobbyMessage.edit(newMsg);
      } else {
        console.log(`${foundGuildMember.displayName} already exist in lobby`);
      }
    });

    collector.on('end', (r, user) => {
      const msg = r.message.toString();
      const foundGuildMember = message.guild.member(user);
      if (msg.indexOf(foundGuildMember.displayName)) {
        console.log(`Adding ${foundGuildMember.displayName} to current lobby`);

        const newMsg = msg.replace('Free', foundGuildMember.displayName);
        lobbyMessage.edit(newMsg);
      } else {
        console.log(`${foundGuildMember.displayName} already exist in lobby`);
      }
    });

    cachedLobbies[user.id] = lobbyMessage;
  }
});

client.on('messageReactionAdd', (message, user) => {

})

client.login(process.env.DISCORD_TOKEN);