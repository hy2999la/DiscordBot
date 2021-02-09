require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

/** @type {Discord.Message} */
let lobbyMessage;

/** @type {Discord.ReactionCollector} */
let collector;
let lobbyUserNames;

const filter = (reaction) => reaction.emoji.name === '👍'

/*
{
  [message.user.id]: [lobbyMessage]
}
*/

client.once('ready', () => {
  console.log('Bot is ready');
  lobbyMessage = null;
  lobbyUserNames = [];
});

client.on('message', async (message) => {
  if (message.mentions.roles.some(r => r.name === "apex-test")) {
    if (lobbyMessage != null) {
      console.log('Cancelling previous lobby');

      lobbyMessage.edit('Lobby has been cancelled');
      lobbyMessage.reactions.removeAll();

      collector.removeAllListeners();
      collector = null;

      lobbyMessage = message;
      lobbyUserNames = [];
    }

    const user = message.member;
    lobbyMessage = await message.channel.send(
      `Creating a Lobby...\n1. ${user.displayName}\n2. Free \n3. Free\nReact to join this lobby`
    );
    lobbyUserNames.push(user.displayName);
    await lobbyMessage.react('👍');

    collector = lobbyMessage.createReactionCollector(filter, { maxUsers: 3 });

    collector.on('collect', (r, user) => {
      const msg = r.message.toString();
      const foundGuildMember = message.guild.member(user);
      if (msg.indexOf(foundGuildMember.displayName) < 0) {
        console.log(`Adding ${foundGuildMember.displayName} to current lobby`);
        lobbyUserNames.push(foundGuildMember.displayName);
        const newMsg = msg.replace('Free', foundGuildMember.displayName);
        lobbyMessage.edit(newMsg);
      } else {
        console.log(`${foundGuildMember.displayName} already exist in lobby`);
      }
    });

    collector.on('end', (collected, reason) => {
      console.log(collected);
      if (collected.get('👍').count >= 2) {
        console.log(`Current Lobby is now full, deleting lobby message!`);
        lobbyMessage.delete();
        lobbyMessage.channel.send(`We have a game ongoing: ${lobbyUserNames[0]}, ${lobbyUserNames[1]}, ${lobbyUserNames[2]}. GL`);
      }

      console.log('collection ended');
    });
  }
});

client.on('messageReactionAdd', (message, user) => {

})

client.login(process.env.DISCORD_TOKEN);