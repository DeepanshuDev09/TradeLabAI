const axios = require("axios");

const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
const MAX_LIMIT = 1000; // Binance's max candles per request

/**
 * Fetches candles for a symbol/interval between startTime and endTime (ms epoch),
 * paginating automatically if the range needs more than 1000 candles.
 *
 * Returns an array of: { openTime, open, high, low, close, volume, closeTime }
 */
async function fetchCandles(symbol, interval, startTime, endTime) {
  const allCandles = [];
  let currentStart = startTime;

  while (currentStart < endTime) {
    const { data } = await axios.get(BINANCE_KLINES_URL, {
      params: {
        symbol,
        interval,
        startTime: currentStart,
        endTime,
        limit: MAX_LIMIT,
      },
    });

    if (!data.length) break;

    const parsed = data.map((k) => ({
      openTime: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      closeTime: k[6],
    }));

    allCandles.push(...parsed);

    const lastCloseTime = data[data.length - 1][6];
    if (data.length < MAX_LIMIT || lastCloseTime >= endTime) break;
    currentStart = lastCloseTime + 1;
  }

  return allCandles;
}

module.exports = { fetchCandles };
