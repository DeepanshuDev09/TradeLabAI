const express = require("express");
const router = express.Router();

const { fetchCandles } = require("../services/binanceService");
const { fetchYFinanceCandles } = require("../services/yfinanceService");
const { runBacktest, simulateTrades, computeStats } = require("../services/backtestEngine");
const { runPythonStrategy } = require("../services/pythonRunner");

const VALID_INDICATORS = ["ema_crossover", "rsi", "macd", "bollinger"];
const VALID_MARKETS = ["crypto", "stocks", "forex"];

/**
 * POST /api/backtest
 * body: { symbol, timeframe, startDate, endDate, strategy, market }
 *
 * `symbol` / `timeframe` can be provided top-level (as Terminal.jsx sends
 * them) or nested inside `strategy` (as StrategyManager.jsx sends them) —
 * top-level wins if both are present.
 *
 * `market`: "crypto" (default) | "stocks" | "forex"
 *   - crypto -> Binance (symbol like "BTCUSDT", "PAXGUSDT" for gold, "XAUTUSDT" for gold)
 *   - stocks -> Yahoo Finance (symbol like "AAPL", "TSLA")
 *   - forex  -> Yahoo Finance (symbol like "EURUSD=X", "GBPJPY=X")
 *
 * strategy is EITHER:
 *   - an AI-generated strategy:  { id, name, code, ...riskParams }
 *   - a manual indicator strategy: { indicator, params, ...riskParams }
 *
 * riskParams (optional on both): initialCapital, positionSizePercent,
 * stopLossPercent, takeProfitPercent
 */
router.post("/backtest", async (req, res) => {
  try {
    const { strategy, startDate, endDate } = req.body;
    const symbol = req.body.symbol || strategy?.symbol;
    const timeframe = req.body.timeframe || strategy?.timeframe;
    const market = (req.body.market || strategy?.market || "crypto").toLowerCase();

    const validationError = validateRequest(strategy, symbol, timeframe, startDate, endDate, market);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const candles = await fetchMarketCandles(market, symbol, timeframe, startDate, endDate);

    if (candles.length < 30) {
      return res.status(400).json({
        error:
          "Not enough candle data for this range/timeframe to run a meaningful backtest (need at least ~30 candles).",
      });
    }

    let backtestResult;

    if (strategy.code) {
      // AI-generated Python strategy
      const signals = await runPythonStrategy(strategy.code, candles);
      backtestResult = simulateTrades(candles, signals, strategy);
    } else {
      // Manual JS indicator strategy
      backtestResult = runBacktest(candles, strategy);
    }

    const stats = computeStats(backtestResult);

    res.json({
      stats,
      trades: backtestResult.trades,
      equityCurve: backtestResult.equityCurve,
      candleCount: candles.length,
      market,
    });
  } catch (err) {
    console.error("Backtest error:", err.message);

    // Binance returns 400 with a helpful message for bad symbols/intervals
    if (err.response && err.response.status === 400) {
      return res.status(400).json({
        error: `Binance rejected the request — check the symbol and timeframe. (${
          err.response.data?.msg || "invalid params"
        })`,
      });
    }

    // Errors thrown by pythonRunner (validation failures, timeouts, bad
    // output, runtime errors in the generated code) or yfinanceService
    // (bad symbol, Yahoo lookback limits, etc.) land here.
    res.status(400).json({ error: err.message || "Failed to run backtest." });
  }
});

async function fetchMarketCandles(market, symbol, timeframe, startDate, endDate) {
  if (market === "crypto") {
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    return fetchCandles(symbol, timeframe, startTime, endTime);
  }
  // stocks + forex both go through Yahoo Finance
  return fetchYFinanceCandles(symbol, timeframe, startDate, endDate);
}

function validateRequest(strategy, symbol, timeframe, startDate, endDate, market) {
  if (!strategy) return "Missing strategy.";
  if (!symbol) return "Symbol is required.";
  if (!timeframe) return "Timeframe is required.";
  if (!startDate || !endDate) return "startDate and endDate are required.";
  if (new Date(startDate) >= new Date(endDate)) return "startDate must be before endDate.";
  if (!VALID_MARKETS.includes(market)) {
    return `Unsupported market "${market}". Use one of: ${VALID_MARKETS.join(", ")}.`;
  }

  const isAiStrategy = Boolean(strategy.code);
  const isManualStrategy = VALID_INDICATORS.includes(strategy.indicator);

  if (!isAiStrategy && !isManualStrategy) {
    return "Strategy must include either AI-generated code or a valid indicator + params.";
  }
  if (isManualStrategy && !strategy.params) {
    return "Strategy is missing indicator params.";
  }
  return null;
}

module.exports = router;
