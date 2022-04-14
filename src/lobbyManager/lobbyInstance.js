import { v4 as uuid } from 'uuid';
import constants from '../utils/constants.js';

export default class Lobby {
  constructor({ game, type, maxSize }) {
    this.game = game;
    this.type = type;
    this.users = new Set();
    this.id = uuid();
    this.maxSize = maxSize;
    this.messageId = '';
    this.message = null;
  }

  setLobbyInteraction(message) {
    this.message = message;
  }

  containsUser(member) {
    return this.users.has(member.user.id);
  }

  addUser(member) {
    if (!this.containsUser(member)) {
      console.log(`${this.game}: Adding ${member.nickname} to current lobby`);
      this.users.add(member.user.id);
    } else {
      console.log(`${this.game}: ${member.nickname} already exist in lobby`);
    }
    console.log(this.users.size);
    return this.users.size === constants[this.game].LOBBY_SIZE;
  }

  removeUser(member) {
    if (this.containsUser(member)) {
      console.log(
        `${this.game}: Removing ${member.nickname} from current lobby`
      );
      this.users.delete(member.user.id);
    } else {
      console.log(
        `${this.game}: Tried removing ${member.nickname}, which is not in the lobby`
      );
    }
  }

  checkLobbyId(lobbyId) {
    return this.id === lobbyId;
  }
}
