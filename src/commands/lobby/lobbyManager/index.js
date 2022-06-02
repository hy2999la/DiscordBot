import Lobby from './lobbyInstance.js';

const lobbies = {};

const sameLobbyOfGameExists = (game) =>
  lobbies[game] && Object.keys(lobbies[game]).length !== 0;

const getLobby = (game) => lobbies[game];

const checkLobbyId = (game, lobbyId) => lobbies[game].checkLobbyId(lobbyId);

const createLobby = async ({ game, maxSize, member, type = null }) => {
  if (sameLobbyOfGameExists(game)) {
    console.log(`${game}: Closing outdated lobby`);
    try {
      const message = await lobbies[game].message;
      await message.edit({ components: [], content: 'Lobby Outdated' });
    } catch (err) {
      console.error(err);
    }
  }

  console.log(`${game}: Creating lobby`);

  lobbies[game] = new Lobby({
    game,
    maxSize,
    type
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
  checkLobbyId,
  closeLobby,
  createLobby,
  getLobby
};
