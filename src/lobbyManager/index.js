import { v4 as uuid } from 'uuid';

import Lobby from './lobbyInstance.js';
import constants from '../utils/constants.js';

const lobbies = {};

const sameLobbyOfGameExists = (game) =>
  lobbies[game] && Object.keys(lobbies[game]).length !== 0;

const getLobbyInstance = (game) => {
  return lobbies[game];
};

const checkLobbyId = (game, lobbyId) => {
  return lobbies[game].checkLobbyId(lobbyId);
};

const createLobby = async ({ game, member, type = null }) => {
  if (sameLobbyOfGameExists(game)) {
    console.log(`${game}: Closing outdated lobby`);
    try {
      const message = await lobbies[game].message;
      await message.edit({ content: 'Lobby Outdated', components: [] });
    } catch (err) {
      console.error(err);
    }
  }

  console.log(`${game}: Creating lobby`);

  lobbies[game] = new Lobby({
    game,
    type,
    maxSize: constants[game].LOBBY_SIZE
  });
  lobbies[game].addUser(member);

  return lobbies[game];
};

const closeLobby = async (lobby) => {
  if (checkLobbyId(lobby.game, lobby.id)) {
    delete lobbies[lobby.game];
  }
};

export default {
  createLobby,
  getLobbyInstance,
  checkLobbyId,
  closeLobby
};
