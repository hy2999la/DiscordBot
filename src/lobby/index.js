const config = require('./config.json');
const constants = require('../utils/constants');

class Lobby {
  constructor(lobbyMessage = null) {
    this.lobbyMessage = lobbyMessage;
    this.collector = null;
    this.lobbyUsers = [];
  }

  // Initializes lobby with the message and the user who mentioned the bot
  async initLobby(message, user) {
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
      `Creating a Lobby...\n1. ${user.displayName}\n2. Free \n3. Free\nReact to join this lobby`
    );
  
    await this.lobbyMessage.react('👍');

    this.collector = this.lobbyMessage.createReactionCollector(() => true, { dispose: true });

    this.collector.on('collect', this.onReact);
    this.collector.on('remove', this.onRemoveReact);
  }

  addUser(user) {
    if (!this.lobbyUsers.hasOwnProperty(user.displayName)) {
      console.log(`Adding ${user.displayName} to current lobby`);
      this.lobbyUsers[user.displayName] = user.id;
      return true;
    } else {
      console.log(`${user.displayName} already exist in lobby`);
      return false;
    }
  }

  clearLobby() {
    this.lobbyMessage = null;
    this.collector.removeAllListeners();
    this.collector = null;
    this.lobbyUserNames = [];
  }

  onReact(r, user) {
    const msg = r.message.toString();
    const foundGuildMember = r.message.guild.member(user);
    if (this.addUser(foundGuildMember)) {
      if (Object.keys(this.lobbyUsers).length == constants.lobbySize.apex) {
        console.log(`Current Lobby is now full, deleting lobby message!`);
        this.lobbyMessage.delete();
        let startMsg = 'Game is starting: ';
        for (let user in this.lobbyUsers) {
          startMsg += `<@${this.lobbyUsers[user]}> /`
        }
        startMsg = startMsg.slice(0, -2);
        startMsg += '. GL';
        this.lobbyMessage.channel.send(startMsg);
        console.log('=============================');
  
        resetCurrLobby();
      } else {
        const newMsg = msg.replace('Free', foundGuildMember.displayName);
        this.lobbyMessage.edit(newMsg);
      }
    }
  }

  onRemoveReact(r, user) {
    const msg = r.message.toString();
    const foundGuildMember = r.message.guild.member(user);
    if (msg.indexOf(foundGuildMember.displayName) > 0) {
      console.log(`Removing ${foundGuildMember.displayName} from current lobby`);
      delete this.lobbyUsers[foundGuildMember.displayName];
      const newMsg = msg.replace(foundGuildMember.displayName, 'Free');
      this.lobbyMessage.edit(newMsg);
    } else {
      console.log(`${foundGuildMember.displayName} is not in the lobby`);
    }
  }

  static getMentions() {
    return config.mentions;
  }
}

module.exports = Lobby;
