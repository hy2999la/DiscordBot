import Discord from 'discord.js';

import constants from '../../utils/constants.js';
import getTickerData from './helper.js';

const { ERRORCODES, YAHOOFINANCE } = constants;

const twoDecimal = (num) =>
  num
    ? Math.abs(num).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })
    : '';

const createStockMessageEmbed = async (ticker) => {
  let tickerInfo;
  try {
    tickerInfo = await getTickerData(ticker);

    if (tickerInfo.shortName === null || tickerInfo.shortName === undefined) {
      return 'Ticker not found';
    }
  } catch (err) {
    if (err.message === ERRORCODES.TICKER_NOT_FOUND) {
      return 'Ticker not found';
    }

    throw err;
  }

  tickerInfo = await getTickerData(ticker);
  const marketPrice =
    tickerInfo.marketState === 'REGULAR'
      ? {
          inline: true,
          name: 'Current Market Price',
          value: `$${twoDecimal(tickerInfo.regularMarketPrice)}`
        }
      : {
          inline: true,
          name: 'Post Market Price',
          value: tickerInfo.postMarketPrice
            ? `$${twoDecimal(tickerInfo.postMarketPrice)}`
            : 'No Post Market Data Available'
        };

  const currMarketDiffPerc =
    tickerInfo.marketState === 'REGULAR'
      ? tickerInfo.regularMarketChangePercent
      : tickerInfo.postMarketChangePercent;

  const currMarketDiff =
    tickerInfo.marketState === 'REGULAR'
      ? tickerInfo.regularMarketChange
      : tickerInfo.postMarketChange;

  let marketDiffText;

  if (currMarketDiff > 0) {
    marketDiffText = `+$${twoDecimal(currMarketDiff)} (+${twoDecimal(
      currMarketDiffPerc
    )}%)`;
  } else if (currMarketDiff < 0) {
    marketDiffText = `-$${twoDecimal(currMarketDiff)} (-${twoDecimal(
      currMarketDiffPerc
    )}%)`;
  } else if (currMarketDiff !== null && currMarketDiff !== undefined) {
    marketDiffText = `$${twoDecimal(currMarketDiff)} (${twoDecimal(
      currMarketDiffPerc
    )}%)`;
  } else {
    marketDiffText = '---';
  }

  const marketDifferencePercent = {
    inline: true,
    name: tickerInfo.marketState === 'REGULAR' ? '+ / -' : 'Post + / -',
    value: marketDiffText
  };

  const highLow = {
    inline: true,
    name: 'High / Low',
    value: `$${twoDecimal(tickerInfo.regularMarketDayHigh)} / $${twoDecimal(
      tickerInfo.regularMarketDayLow
    )}`
  };

  const message = new Discord.MessageEmbed()
    .setTitle(`${tickerInfo.shortName}`)
    .setURL(`${YAHOOFINANCE.webpage}/${tickerInfo.symbol}`)
    .setDescription(`${tickerInfo.symbol} | ${tickerInfo.fullExchangeName}`)
    .addFields(marketPrice, marketDifferencePercent, highLow);

  if (currMarketDiff < 0) {
    message.setColor('#ff0000');
  } else if (currMarketDiff > 0) {
    message.setColor('#008000');
  } else {
    message.setColor('#c0c0c0');
  }

  if (tickerInfo.marketState !== 'REGULAR') {
    const closedMarketDiff = tickerInfo.regularMarketChangePercent;
    let closedMarketDiffText;
    if (closedMarketDiff > 0) {
      closedMarketDiffText = `+$${twoDecimal(
        tickerInfo.regularMarketChange
      )} (+${twoDecimal(closedMarketDiff)}%)`;
    } else if (currMarketDiff < 0) {
      closedMarketDiffText = `-$${twoDecimal(
        tickerInfo.regularMarketChange
      )} (-${twoDecimal(closedMarketDiff)}%)`;
    } else {
      closedMarketDiffText = `$${twoDecimal(
        tickerInfo.regularMarketChange
      )} (${twoDecimal(closedMarketDiff)}%)`;
    }

    message.addFields(
      {
        inline: true,
        name: 'Closing Market Price',
        value: `$${twoDecimal(tickerInfo.regularMarketPrice)}`
      },
      {
        inline: true,
        name: 'Closing + / -',
        value: closedMarketDiffText
      }
    );
  }

  return message;
};

export default { createStockMessageEmbed };
