/**
 * Indicator calculations. All functions take an array of numbers (closes)
 * and return an array of the same length, padded with `null` where there
 * isn't enough data yet (so indexes stay aligned with the candle array).
 */

function ema(values, period) {
  const result = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let prevEma = null;

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) continue;

    if (prevEma === null) {
      // seed with a simple average of the first `period` values
      const seedSlice = values.slice(i - period + 1, i + 1);
      prevEma = seedSlice.reduce((a, b) => a + b, 0) / period;
    } else {
      prevEma = values[i] * k + prevEma * (1 - k);
    }
    result[i] = prevEma;
  }
  return result;
}

function rsi(values, period = 14) {
  const result = new Array(values.length).fill(null);
  if (values.length <= period) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = values[i] - values[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  result[period] = calcRsiFromAvg(avgGain, avgLoss);

  for (let i = period + 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i] = calcRsiFromAvg(avgGain, avgLoss);
  }
  return result;
}

function calcRsiFromAvg(avgGain, avgLoss) {
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function macd(values, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEma = ema(values, fastPeriod);
  const slowEma = ema(values, slowPeriod);

  const macdLine = values.map((_, i) =>
    fastEma[i] !== null && slowEma[i] !== null ? fastEma[i] - slowEma[i] : null
  );

  // signal line = EMA of macdLine, but only over the defined (non-null) portion
  const firstValidIdx = macdLine.findIndex((v) => v !== null);
  const signalLine = new Array(values.length).fill(null);

  if (firstValidIdx !== -1) {
    const macdSlice = macdLine.slice(firstValidIdx).map((v) => v);
    const signalOnSlice = ema(macdSlice, signalPeriod);
    signalOnSlice.forEach((v, i) => {
      signalLine[firstValidIdx + i] = v;
    });
  }

  const histogram = values.map((_, i) =>
    macdLine[i] !== null && signalLine[i] !== null ? macdLine[i] - signalLine[i] : null
  );

  return { macdLine, signalLine, histogram };
}

function bollingerBands(values, period = 20, stdDevMultiplier = 2) {
  const upper = new Array(values.length).fill(null);
  const middle = new Array(values.length).fill(null);
  const lower = new Array(values.length).fill(null);

  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const stdDev = Math.sqrt(variance);

    middle[i] = mean;
    upper[i] = mean + stdDevMultiplier * stdDev;
    lower[i] = mean - stdDevMultiplier * stdDev;
  }

  return { upper, middle, lower };
}

module.exports = { ema, rsi, macd, bollingerBands };
