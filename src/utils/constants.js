export default {
  ALLOWED_CHANNELS: {
    dev: '808576788791427092', // bot-test,
    prod: {
      apex: [
        '808419512390516786', // apex
        '270085469667065856' // main chat
      ],
      bestgame: [
        '270085469667065856' // main chat
      ],
      lobby: [
        '808419512390516786', // apex
        '270085469667065856' // main chat
      ]
    }
  },
  ERRORCODES: {
    ERROR_FETCHING_TICKER_DATA: 'ERROR_FETCHING_TICKER_DATA',
    TICKER_NOT_FOUND: 'TICKER_NOT_FOUND'
  },
  YAHOOFINANCE: {
    queryUrl: 'https://query1.finance.yahoo.com/v7/finance/quote',
    webpage: 'https://finance.yahoo.com/quote'
  }
};
