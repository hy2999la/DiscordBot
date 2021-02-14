const config = require('./config.json');

class Lobby {
  constructor(lobbyMessage = null) {
    this.lobbyMessage = lobbyMessage;
    this.collector = null;
    this.lobbyUsers = null;
  }

  
}

module.exports = Lobby;
