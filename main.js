require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const mentions = ['apex', 'apex-test'];
const MAX_LOBBY = 3;

/** @type {Discord.Message} */
let lobbyMessage = null;

/** @type {Discord.ReactionCollector} */
let collector = null;
let lobbyUserNames = {};

/// Helper

const filter = (reaction) => reaction.emoji.name === '👍';

const addUserToLobby = (user) => {
  if (!lobbyUserNames.hasOwnProperty(user.displayName)) {
    console.log(`Adding ${user.displayName} to current lobby`);
    lobbyUserNames[user.displayName] = user.id;
    return true;
  } else {
    console.log(`${user.displayName} already exist in lobby`);
    return false;
  }
};

const onReact = (r, user) => {
  const msg = r.message.toString();
  const foundGuildMember = r.message.guild.member(user);
  if (addUserToLobby(foundGuildMember)) {
    if (Object.keys(lobbyUserNames).length == MAX_LOBBY) {
      console.log(`Current Lobby is now full, deleting lobby message!`);
      lobbyMessage.delete();
      let startMsg = 'Game is starting: ';
      for (let user in lobbyUserNames) {
        startMsg += `<@${lobbyUserNames[user]}> /`
      }
      startMsg = startMsg.slice(0, -2);
      startMsg += '. GL';
      lobbyMessage.channel.send(startMsg);
      console.log('=============================');

      resetCurrLobby();
    } else {
      const newMsg = msg.replace('Free', foundGuildMember.displayName);
      lobbyMessage.edit(newMsg);
    }
  }
};

const onRemoveReact = (r, user) => {
  const msg = r.message.toString();
  const foundGuildMember = r.message.guild.member(user);
  if (msg.indexOf(foundGuildMember.displayName) > 0) {
    console.log(`Removing ${foundGuildMember.displayName} from current lobby`);
    delete lobbyUserNames[foundGuildMember.displayName];
    const newMsg = msg.replace(foundGuildMember.displayName, 'Free');
    lobbyMessage.edit(newMsg);
  } else {
    console.log(`${foundGuildMember.displayName} is not in the lobby`);
  }
}

const resetCurrLobby = () => {
  lobbyMessage = null;
  collector.removeAllListeners();
  collector = null;
  lobbyUserNames = [];
};

const createLobby = async (msg, user) => {
  if (lobbyMessage != null && !lobbyMessage.deleted) {
    // There's a lobby already
    console.log('Cancelling lobby');
    console.log('=============================');

    lobbyMessage.edit('Lobby has been cancelled');
    lobbyMessage.reactions.removeAll();

    resetCurrLobby();
  }

  console.log('Creating lobby');
  console.log('=============================');
  
  lobbyMessage = msg;
  addUserToLobby(user);
  lobbyMessage = await msg.channel.send(
    `Creating a Lobby...\n1. ${user.displayName}\n2. Free \n3. Free\nReact to join this lobby`
  );

  await lobbyMessage.react('👍');

  collector = lobbyMessage.createReactionCollector(filter, { dispose: true });

  collector.on('collect', onReact);
  collector.on('remove', onRemoveReact);
};


/// Client

client.once('ready', () => {
  console.log('Bot is ready');
});

client.on('message', async (message) => {
  if (message.mentions.roles.some(r => mentions.indexOf(r.name) >= 0) || message.content === '!start') {
    const user = message.member;
    createLobby(message, user);
  }
});

client.login(process.env.DISCORD_TOKEN);