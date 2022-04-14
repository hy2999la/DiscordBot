export default {
  apex: {
    LOBBY_SIZE: 3,
    MESSAGE: `{ROLE_ID}
Creating Apex Lobby...
**
1. -Free-
2. -Free-
3. -Free-
**
`,
    ROLE_ID: '746118673470717962'
  },
  league: {
    LOBBY_SIZE: 1,
    MESSAGE: `{ROLE_ID}
Creating **{type}** Lobby...
**
1. -Free-
2. -Free-
3. -Free-
4. -Free-
5. -Free-
**
`,
    ROLE_ID: '904901911310909491'
  },
  LOBBY: {
    ALLOWED_CHANNELS: [
      '808576788791427092', // bot-test
      '921950427484917811' // lobby
    ],
    MESSAGE: 'Which lobby would you like to start?'
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
