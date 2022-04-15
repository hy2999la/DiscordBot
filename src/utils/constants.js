export default {
  apex: {
    LOBBY_SIZE: 3,
    MESSAGE: `{ROLE_ID}
Creating Apex Lobby...
--**
1. -Free-
2. -Free-
3. -Free-
**
`,
    ROLE_ID: '746118673470717962'
  },
  league: {
    LOBBY_SIZE: 5,
    OPTIONS_MESSAGE: 'Which lobby would you like to start?',
    MESSAGE: `{ROLE_ID}
Creating **{type}** Lobby...
--**
1. -Free-
2. -Free-
3. -Free-
4. -Free-
5. -Free-
**
`,
    ROLE_ID: '904901911310909491'
  },
  ALLOWED_CHANNELS: {
    prod: {
      bestgame: [
        '270085469667065856' // main chat
      ],
      apex: [
        '808419512390516786', // apex
        '270085469667065856' // main chat
      ],
      lobby: [
        '808419512390516786', // apex
        '270085469667065856' // main chat
      ]
    },
    dev: {
      bestgame: [
        '808576788791427092' // bot-test
      ],
      apex: [
        '808576788791427092' // bot-test
      ],
      lobby: [
        '808576788791427092' // bot-test
      ]
    }
  },
  YAHOOFINANCE: {
    queryUrl: 'https://query1.finance.yahoo.com/v7/finance/quote',
    webpage: 'https://finance.yahoo.com/quote'
  },
  ERRORCODES: {
    TICKER_NOT_FOUND: 'TICKER_NOT_FOUND',
    ERROR_FETCHING_TICKER_DATA: 'ERROR_FETCHING_TICKER_DATA'
  }
};
