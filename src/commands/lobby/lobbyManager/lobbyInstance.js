import { v4 as uuid } from 'uuid';

export default class Lobby {
  constructor({ game, maxSize, type }) {
    this.game = game;
    this.type = type;
    this.users = {};
    this.id = uuid();
    this.maxSize = maxSize;
  }

  containsUser(member) {
    return this.users[member.user.id] != null;
  }

  addUser(member) {
    if (!this.containsUser(member)) {
      console.log(`[${this.game}] Adding ${member.nickname} to current lobby`);
      this.users[member.user.id] = member.nickname;
    } else {
      console.log(`[${this.game}] ${member.nickname} already exist in lobby`);
    }
    return Object.keys(this.users).length === this.maxSize;
  }

  removeUser(member) {
    if (this.containsUser(member)) {
      console.log(
        `[${this.game}] Removing ${member.nickname} from current lobby`
      );
      delete this.users[member.user.id];
    } else {
      console.log(
        `[${this.game}] Tried removing ${member.nickname}, which is not in the lobby`
      );
    }
  }

  checkLobbyId(lobbyId) {
    return this.id === lobbyId;
  }
}
