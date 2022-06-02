import fetch from 'node-fetch';

import constants from '../../utils/constants.js';

const { YAHOOFINANCE } = constants;

export default {
  getTickerData: async (ticker) => {
    let result;
    try {
      result = await fetch(`${YAHOOFINANCE.queryUrl}?symbols=${ticker}`);
    } catch (err) {
      console.log(err);
      throw new Error('ERROR_FETCHING_TICKER');
    }

    let data = await result.json();

    if (data.quoteResponse && data.quoteResponse.result.length === 0) {
      // Try to append .TO for TORONTO EXCHANGE
      try {
        result = await fetch(`${YAHOOFINANCE.queryUrl}?symbols=${ticker}.TO`);
      } catch (err) {
        console.log(err);
        throw new Error('ERROR_FETCHING_TICKER');
      }

      data = await result.json();
    }

    if (data.quoteResponse && data.quoteResponse.result.length > 0) {
      const tickerData = data.quoteResponse.result[0];

      return {
        currency: tickerData.currency,
        fullExchangeName: tickerData.fullExchangeName,
        marketState: tickerData.marketState,
        postMarketChange: tickerData.postMarketChange,
        postMarketChangePercent: tickerData.postMarketChangePercent,
        postMarketPrice: tickerData.postMarketPrice,
        quoteSourceName: tickerData.quoteSourceName,
        regularMarketChange: tickerData.regularMarketChange,
        regularMarketChangePercent: tickerData.regularMarketChangePercent,
        regularMarketDayHigh: tickerData.regularMarketDayHigh,
        regularMarketDayLow: tickerData.regularMarketDayLow,
        regularMarketPrice: tickerData.regularMarketPrice,
        shortName: tickerData.shortName,
        symbol: tickerData.symbol
      };
    }

    throw new Error('TICKER_NOT_FOUND');
  }
};
