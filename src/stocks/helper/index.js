const fetch = require('node-fetch');

module.exports = {
  getTickerData: async (ticker) => {
    const result = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`);
    const data = await result.json();

    if (data.quoteResponse && data.quoteResponse.result.length > 0) {
      const tickerData = data.quoteResponse.result[0];

      return {
        quoteSourceName: tickerData.quoteSourceName,
        currency: tickerData.currency,
        postMarketChangePercent: tickerData.postMarketChangePercent,
        postMarketPrice: tickerData.postMarketPrice,
        regularMarketChange: tickerData.regularMarketChange,
        regularMarketChangePercent: tickerData.regularMarketChangePercent,
        regularMarketPrice: tickerData.regularMarketPrice,
        regularMarketDayHigh: tickerData.regularMarketDayHigh,
        regularMarketDayLow: tickerData.regularMarketDayLow,
        fullExchangeName: tickerData.fullExchangeName,
        shortName: tickerData.shortName,
        symbol:  tickerData.symbol,
      }
    } else {
      throw new Error("Can't find ticker symbol");
    }
  }
}