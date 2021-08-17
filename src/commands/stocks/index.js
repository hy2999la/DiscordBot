import Discord from 'discord.js';

import getTickerData from './helper.js';
import constants from '../../utils/constants.js';
const { YAHOOFINANCE, ERRORCODES } = constants;

const twoDecimal = num => {
	return num ? Math.abs(num).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '';
};

const createStockMessageEmbed = async (ticker) => {
	let tickerInfo;
	try {
		tickerInfo = await getTickerData(ticker);

		if (tickerInfo.shortName === null || tickerInfo.shortName === undefined) {
			return 'Ticker not found';
		}
	}
	catch (err) {
		if (err.message === ERRORCODES.TICKER_NOT_FOUND) {
			return 'Ticker not found';
		}
		else {
			throw err;
		}
	}

	tickerInfo = await getTickerData(ticker);
	const marketPrice = tickerInfo.marketState === 'REGULAR' ? {
		name: 'Current Market Price',
		value: `$${twoDecimal(tickerInfo.regularMarketPrice)}`,
		inline: true,
	} : {
		name: 'Post Market Price',
		value: tickerInfo.postMarketPrice ? `$${twoDecimal(tickerInfo.postMarketPrice)}` : 'No Post Market Data Available',
		inline: true,
	};

	const currMarketDiffPerc = tickerInfo.marketState === 'REGULAR' ?
		tickerInfo.regularMarketChangePercent : tickerInfo.postMarketChangePercent;

	const currMarketDiff = tickerInfo.marketState === 'REGULAR' ?
		tickerInfo.regularMarketChange : tickerInfo.postMarketChange;

	let marketDiffText;

	if (currMarketDiff > 0) {
		marketDiffText = `+$${twoDecimal(currMarketDiff)} (+${twoDecimal(currMarketDiffPerc)}%)`;
	}
	else if (currMarketDiff < 0) {
		marketDiffText = `-$${twoDecimal(currMarketDiff)} (-${twoDecimal(currMarketDiffPerc)}%)`;
	}
	else if (currMarketDiff !== null && currMarketDiff !== undefined) {
		marketDiffText = `$${twoDecimal(currMarketDiff)} (${twoDecimal(currMarketDiffPerc)}%)`;
	}
	else {
		marketDiffText = '---';
	}

	const marketDifferencePercent = {
		name: tickerInfo.marketState === 'REGULAR' ? '+ / -' : 'Post + / -',
		value: marketDiffText,
		inline: true,
	};

	const highLow = {
		name: 'High / Low',
		value: `$${twoDecimal(tickerInfo.regularMarketDayHigh)} / $${twoDecimal(tickerInfo.regularMarketDayLow)}`,
		inline: true,
	};

	const message = new Discord.MessageEmbed()
		.setTitle(`${tickerInfo.shortName}`)
		.setURL(`${YAHOOFINANCE.webpage}/${tickerInfo.symbol}`)
		.setDescription(`${tickerInfo.symbol} | ${tickerInfo.fullExchangeName}`)
		.addFields(marketPrice, marketDifferencePercent, highLow);

	if (currMarketDiff < 0) {
		message.setColor('#ff0000');
	}
	else if (currMarketDiff > 0) {
		message.setColor('#008000');
	}
	else {
		message.setColor('#c0c0c0');
	}

	if (tickerInfo.marketState !== 'REGULAR') {
		const closedMarketDiff = tickerInfo.regularMarketChangePercent;
		let closedMarketDiffText;
		if (closedMarketDiff > 0) {
			closedMarketDiffText = `+$${twoDecimal(tickerInfo.regularMarketChange)} (+${twoDecimal(closedMarketDiff)}%)`;
		}
		else if (currMarketDiff < 0) {
			closedMarketDiffText = `-$${twoDecimal(tickerInfo.regularMarketChange)} (-${twoDecimal(closedMarketDiff)}%)`;
		}
		else {
			closedMarketDiffText = `$${twoDecimal(tickerInfo.regularMarketChange)} (${twoDecimal(closedMarketDiff)}%)`;
		}

		message.addFields({
			name: 'Closing Market Price',
			value: `$${twoDecimal(tickerInfo.regularMarketPrice)}`,
			inline: true,
		},
		{
			name: 'Closing + / -',
			value: closedMarketDiffText,
			inline: true,
		});
	}

	return message;
};

export { createStockMessageEmbed };