require('dotenv').config();

const fetch = require('node-fetch');

const config = require('../../../config.json');
const { APEX } = require('../../../utils/constants');

class Lobby {
  constructor() {
    this.lobbyMessage = null;
    this.collector = null;
    this.lobbyUsers = {};
  }

  // Initializes lobby with the message and the user who mentioned the bot
  initLobby = async (message, user) => {
    if (this.lobbyMessage != null && !this.lobbyMessage.deleted) {
      // There's a lobby already
      console.log('Cancelling lobby');
      console.log('=============================');

      this.lobbyMessage.edit('Lobby has been cancelled');
      this.lobbyMessage.reactions.removeAll();

      this.clearLobby();
    }

    console.log('Creating lobby');
    console.log('=============================');

    this.addUser(user);

    this.lobbyMessage = await message.channel.send(
      `Creating a Lobby...\n**\n\n1. ${user.displayName}\n2. Free\n3. Free\nReact to join this lobby`
    );

    await this.lobbyMessage.react('👍');

    this.collector = this.lobbyMessage.createReactionCollector(() => true, { dispose: true });

    this.collector.on('collect', this.onReact);
    this.collector.on('remove', this.onRemoveReact);
  }

  addUser = user => {
    if (!this.lobbyUsers.hasOwnProperty(user.displayName)) {
      console.log(`Adding ${user.displayName} to current lobby`);
      this.lobbyUsers[user.displayName] = user.id;
      return true;
    } else {
      console.log(`${user.displayName} already exist in lobby`);
      return false;
    }
  }

  removeUser = user => {
    if (this.lobbyUsers.hasOwnProperty(user.displayName)) {
      console.log(`Removing ${user.displayName} from current lobby`);
      delete this.lobbyUsers[user.displayName];
      return true;
    } else {
      console.log(`${user.displayName} is not in the lobby`);
      return false;
    }
  }

  clearLobby = () => {
    this.lobbyMessage = null;
    this.collector.removeAllListeners();
    this.collector = null;
    this.lobbyUsers = [];
  }

  onReact = (r, user) => {
    const msg = r.message.toString();
    const foundGuildMember = r.message.guild.member(user);
    if (this.addUser(foundGuildMember)) {
      if (Object.keys(this.lobbyUsers).length == APEX.LOBBY_SIZE) {
        console.log(`Current Lobby is now full, deleting old message and pinging current lobby users`);
        this.lobbyMessage.delete();
        let startMsg = 'Game is starting: ';
        for (let user in this.lobbyUsers) {
          startMsg += `<@${this.lobbyUsers[user]}> /`
        }
        startMsg = startMsg.slice(0, -2);
        startMsg += '. GL';
        this.lobbyMessage.channel.send(startMsg);
        console.log('=============================');

        this.clearLobby();
      } else {
        const newMsg = msg.replace('Free', foundGuildMember.displayName);
        this.lobbyMessage.edit(newMsg);
      }
    }
  }

  onRemoveReact = (r, user) => {
    const msg = r.message.toString();
    const foundGuildMember = r.message.guild.member(user);

    if (this.removeUser(foundGuildMember)) {
      const newMsg = msg.replace(foundGuildMember.displayName, 'Free');
      this.lobbyMessage.edit(newMsg); 
    } else {
      console.log(`Tried removing ${foundGuildMember.displayName} but user is not in the lobby`);
    }
  }

  getMentions() {
    return config.mentions;
  }
}

module.exports = new Lobby();

