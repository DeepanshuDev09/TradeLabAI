const { ema, rsi, macd, bollingerBands } = require("./indicators");

/**
 * Generates an array of "buy" | "sell" | null signals, one per candle,
 * based on the strategy's indicator type and params.
 */
function generateSignals(candles, strategy) {
  const closes = candles.map((c) => c.close);
  const signals = new Array(candles.length).fill(null);
  const { indicator, params } = strategy;

  if (indicator === "ema_crossover") {
    const fast = ema(closes, params.fastPeriod);
    const slow = ema(closes, params.slowPeriod);

    for (let i = 1; i < candles.length; i++) {
      if (fast[i] === null || slow[i] === null || fast[i - 1] === null || slow[i - 1] === null)
        continue;
      const crossedUp = fast[i - 1] <= slow[i - 1] && fast[i] > slow[i];
      const crossedDown = fast[i - 1] >= slow[i - 1] && fast[i] < slow[i];
      if (crossedUp) signals[i] = "buy";
      if (crossedDown) signals[i] = "sell";
    }
  }

  if (indicator === "rsi") {
    const rsiValues = rsi(closes, params.period);

    for (let i = 1; i < candles.length; i++) {
      if (rsiValues[i] === null || rsiValues[i - 1] === null) continue;
      const recoveredFromOversold =
        rsiValues[i - 1] < params.oversold && rsiValues[i] >= params.oversold;
      const droppedFromOverbought =
        rsiValues[i - 1] > params.overbought && rsiValues[i] <= params.overbought;
      if (recoveredFromOversold) signals[i] = "buy";
      if (droppedFromOverbought) signals[i] = "sell";
    }
  }

  if (indicator === "macd") {
    const { macdLine, signalLine } = macd(
      closes,
      params.fastPeriod,
      params.slowPeriod,
      params.signalPeriod
    );

    for (let i = 1; i < candles.length; i++) {
      if (
        macdLine[i] === null ||
        signalLine[i] === null ||
        macdLine[i - 1] === null ||
        signalLine[i - 1] === null
      )
        continue;
      const crossedUp = macdLine[i - 1] <= signalLine[i - 1] && macdLine[i] > signalLine[i];
      const crossedDown = macdLine[i - 1] >= signalLine[i - 1] && macdLine[i] < signalLine[i];
      if (crossedUp) signals[i] = "buy";
      if (crossedDown) signals[i] = "sell";
    }
  }

  if (indicator === "bollinger") {
    const { upper, lower } = bollingerBands(closes, params.period, params.stdDev);

    for (let i = 1; i < candles.length; i++) {
      if (upper[i] === null || lower[i] === null) continue;
      const crossedBelowLower = closes[i - 1] >= lower[i - 1] && closes[i] < lower[i];
      const crossedAboveUpper = closes[i - 1] <= upper[i - 1] && closes[i] > upper[i];
      if (crossedBelowLower) signals[i] = "buy";
      if (crossedAboveUpper) signals[i] = "sell";
    }
  }

  return signals;
}

/**
 * Simulates a strategy over the candles using a pre-computed signals array
 * (same length as candles). Works whether the signals came from the JS
 * indicator engine (plain "buy" | "sell" | null strings, long-only, uses
 * the fixed % stop-loss/take-profit from riskParams) or a more advanced
 * Python strategy that needs shorts and/or a custom per-trade stop/target
 * price computed from the candles themselves. For the latter, an element
 * can instead be an object:
 *   { action: "buy" | "short", stop: <price>, target: <price> }
 *   { action: "sell" | "cover" }   // manual exit of an open position
 * "stop"/"target" are optional even on object signals — omit either to
 * fall back to the fixed % from riskParams.
 * Applies stop/target intrabar using candle high/low (stop takes priority
 * if a single candle's range hits both).
 */
function simulateTrades(candles, signals, riskParams = {}) {
  const {
    initialCapital = 10000,
    positionSizePercent = 100,
    stopLossPercent = 2,
    takeProfitPercent = 4,
    riskMode = "percent", // "percent" | "fixed_dollar"
    fixedRiskAmount = 10, // only used when riskMode === "fixed_dollar"
    allowLeverage = false, // cap fixed-dollar sizing at available capital unless true
  } = riskParams;

  let capital = initialCapital;
  let position = null; // { direction: 'long'|'short', entryPrice, entryTime, capitalAtEntry, stopPrice, takeProfitPrice }
  const trades = [];
  const equityCurve = [{ time: candles[0]?.openTime ?? 0, equity: capital }];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const signal = normalizeSignal(signals[i]);

    if (position) {
      let exitPrice = null;
      let exitReason = null;

      if (position.direction === "long") {
        if (candle.low <= position.stopPrice) {
          exitPrice = position.stopPrice;
          exitReason = "stop_loss";
        } else if (candle.high >= position.takeProfitPrice) {
          exitPrice = position.takeProfitPrice;
          exitReason = "take_profit";
        } else if (signal.type === "sell") {
          exitPrice = candle.close;
          exitReason = "signal";
        }
      } else {
        // short: stop is ABOVE entry, target is BELOW entry
        if (candle.high >= position.stopPrice) {
          exitPrice = position.stopPrice;
          exitReason = "stop_loss";
        } else if (candle.low <= position.takeProfitPrice) {
          exitPrice = position.takeProfitPrice;
          exitReason = "take_profit";
        } else if (signal.type === "cover") {
          exitPrice = candle.close;
          exitReason = "signal";
        }
      }

      if (exitPrice !== null) {
        const pnlPercent =
          position.direction === "long"
            ? ((exitPrice - position.entryPrice) / position.entryPrice) * 100
            : ((position.entryPrice - exitPrice) / position.entryPrice) * 100;
        const pnlAmount = position.capitalAtEntry * (pnlPercent / 100);
        capital += pnlAmount;

        trades.push({
          direction: position.direction,
          entryTime: position.entryTime,
          exitTime: candle.closeTime,
          entryPrice: position.entryPrice,
          exitPrice,
          pnlPercent,
          pnlAmount,
          exitReason,
          result: pnlAmount >= 0 ? "win" : "loss",
        });

        equityCurve.push({ time: candle.closeTime, equity: capital });
        position = null;
        continue;
      }
    }

    if (!position && (signal.type === "buy" || signal.type === "short")) {
      const entryPrice = candle.close;
      const isLong = signal.type === "buy";

      const stopPrice =
        signal.stop ?? entryPrice * (isLong ? 1 - stopLossPercent / 100 : 1 + stopLossPercent / 100);
      const takeProfitPrice =
        signal.target ?? entryPrice * (isLong ? 1 + takeProfitPercent / 100 : 1 - takeProfitPercent / 100);

      let capitalAtEntry;

      if (riskMode === "fixed_dollar") {
        const stopDistance = Math.abs(entryPrice - stopPrice);
        if (stopDistance <= 0) {
          // Can't size a trade with zero stop distance — skip this signal entirely.
          continue;
        }
        // Position value such that a full stop-loss hit loses exactly
        // fixedRiskAmount: capitalAtEntry * (stopDistance / entryPrice) = fixedRiskAmount
        capitalAtEntry = fixedRiskAmount * (entryPrice / stopDistance);
        if (!allowLeverage) {
          capitalAtEntry = Math.min(capitalAtEntry, capital);
        }
      } else {
        capitalAtEntry = capital * (positionSizePercent / 100);
      }

      position = {
        direction: isLong ? "long" : "short",
        entryPrice,
        entryTime: candle.openTime,
        capitalAtEntry,
        stopPrice,
        takeProfitPrice,
      };
    }
  }

  return { trades, equityCurve, finalCapital: capital, initialCapital };
}

/**
 * Normalizes a raw signal element (string or object) into a consistent
 * shape. Keeps plain "buy"/"sell" strings working exactly as before.
 */
function normalizeSignal(raw) {
  if (raw == null) return { type: null };

  if (typeof raw === "string") {
    if (raw === "buy") return { type: "buy" };
    if (raw === "sell") return { type: "sell" };
    if (raw === "short") return { type: "short" };
    if (raw === "cover") return { type: "cover" };
    return { type: null };
  }

  if (typeof raw === "object") {
    const action = raw.action;
    if (action === "buy" || action === "long")
      return { type: "buy", stop: raw.stop, target: raw.target };
    if (action === "short") return { type: "short", stop: raw.stop, target: raw.target };
    if (action === "sell" || action === "close") return { type: "sell" };
    if (action === "cover") return { type: "cover" };
  }

  return { type: null };
}

/**
 * Convenience wrapper for JS indicator-based strategies (ema_crossover, rsi,
 * macd, bollinger): generates signals from the indicator, then simulates.
 */
function runBacktest(candles, strategy) {
  const signals = generateSignals(candles, strategy);
  return simulateTrades(candles, signals, strategy);
}

function computeStats({ trades, equityCurve, finalCapital, initialCapital }) {
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === "win");
  const losses = trades.filter((t) => t.result === "loss");

  const grossProfit = wins.reduce((sum, t) => sum + t.pnlAmount, 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnlAmount, 0));

  let peak = -Infinity;
  let maxDrawdownPercent = 0;
  for (const point of equityCurve) {
    if (point.equity > peak) peak = point.equity;
    const drawdown = ((peak - point.equity) / peak) * 100;
    if (drawdown > maxDrawdownPercent) maxDrawdownPercent = drawdown;
  }

  return {
    totalTrades,
    winCount: wins.length,
    lossCount: losses.length,
    winRate: totalTrades ? (wins.length / totalTrades) * 100 : 0,
    totalReturnPercent: ((finalCapital - initialCapital) / initialCapital) * 100,
    maxDrawdownPercent,
    profitFactor: grossLoss === 0 ? null : grossProfit / grossLoss,
    finalCapital,
  };
}

module.exports = { generateSignals, simulateTrades, runBacktest, computeStats };