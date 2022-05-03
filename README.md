# Personal Discord Bot
A Bot that is used for various commands on my personal discord server:

# Usage
To start the bot:

`npm start`

# Bot Commands
## Game Lobby Manager
Creates a lobby for games using Discord's interaction command

### Features
- Users can join or leave the lobby.
- Once lobby has reached the predefined maximum number of players for the lobby, it will notify each user with a mention/ping.
- Users can click on the Start button to start the lobby prematurely (without a full lobby).
- Support for multiple lobbies simultaneously for different games.
  - Only 1 lobby per game, users should only join the current active lobby, activating the command again will just override the old lobby.
- Easy expansion by simply adding new config files for a new game (Starting message template, Maximum number of players).
- Lightweight, in-memory, doesn't need support for persistance, since open lobbies typically do not span across long periods of time.
