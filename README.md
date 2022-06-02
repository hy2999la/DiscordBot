# Personal Discord Bot

A Bot that is used for various commands on my personal discord server:

# Usage

To register commands:

`npm run update-commands`

To start the bot:

`npm start`

# Bot Commands

## Game Lobby Manager

Creates a lobby for games using Discord's interaction command

### Features

- Users can join or leave the lobby.
- Once lobby has reached the predefined maximum number of players, it will notify each user with a ping.
- Users can click on the Start button to start the lobby prematurely (without a full lobby).
- Support for multiple lobbies simultaneously for different games.
  - Only 1 lobby per game, users should only join the current active lobby.
- Easy expansion by simply adding new config files for a new game (Starting message template, Maximum number of players).
- Lightweight, in-memory, doesn't need support for persistance, since open lobbies typically do not span across long periods of time.

### How to add a new game lobby

Add a new definitions file to: `/src/commands/lobby/games/`
```js
// apex.js
export default {
  command: 'apex',
  description: 'Apex Legends Lobby',
  displayName: 'Apex',
  name: 'apex',
  params: {
    roleId: '<Role ID to ping>',
    size: 3
  }
};
```

Also supports games with different types of lobbies!
```js
// league.js
export default {
  command: 'bestgame',
  description: 'League of Legends Lobby',
  displayName: 'League',
  name: 'league',
  params: [
    {
      displayName: 'ARAM',
      name: 'aram',
      roleId: '<Role ID to ping>',
      size: 5
    },
    {
      displayName: 'Normal',
      name: 'norms',
      roleId: '<Role ID to ping>',
      size: 5
    },
    {
      displayName: 'Ranked',
      name: 'ranked',
      roleId: '<Role ID to ping>',
      size: 5
    }
  ]
};
```
