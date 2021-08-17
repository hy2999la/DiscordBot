import fetch from 'node-fetch';

import constants from '../../utils/constants.js';
const { YAHOOFINANCE } = constants;

export default {
	getTickerData: async (ticker) => {
		let result;
		try {
			result = await fetch(`${YAHOOFINANCE.queryUrl}?symbols=${ticker}`);
		}
		catch (err) {
			console.log(err);
			throw new Error('ERROR_FETCHING_TICKER');
		}

		let data = await result.json();

		if (data.quoteResponse && data.quoteResponse.result.length == 0) {
			// Try to append .TO for TORONTO EXCHANGE
			try {
				result = await fetch(`${YAHOOFINANCE.queryUrl}?symbols=${ticker}.TO`);
			}
			catch (err) {
				console.log(err);
				throw new Error('ERROR_FETCHING_TICKER');
			}

			data = await result.json();
		}

		if (data.quoteResponse && data.quoteResponse.result.length > 0) {
			const tickerData = data.quoteResponse.result[0];

			return {
				quoteSourceName: tickerData.quoteSourceName,
				currency: tickerData.currency,
				postMarketChange: tickerData.postMarketChange,
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
				marketState: tickerData.marketState,
			};
		}
		else {
			throw new Error('TICKER_NOT_FOUND');
		}
	},
};