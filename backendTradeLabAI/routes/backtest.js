const express = require("express");
const router = express.Router();

const { fetchCandles } = require("../services/binanceService");
const { runBacktest, simulateTrades, computeStats } = require("../services/backtestEngine");
const { runPythonStrategy } = require("../services/pythonRunner");

const VALID_INDICATORS = ["ema_crossover", "rsi", "macd", "bollinger"];

/**
 * POST /api/backtest
 * body: { symbol, timeframe, startDate, endDate, strategy }
 *
 * `symbol` / `timeframe` can be provided top-level (as Terminal.jsx sends
 * them) or nested inside `strategy` (as StrategyManager.jsx sends them) —
 * top-level wins if both are present.
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

    const validationError = validateRequest(strategy, symbol, timeframe, startDate, endDate);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    const candles = await fetchCandles(symbol, timeframe, startTime, endTime);

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
    // output, runtime errors in the generated code) land here.
    res.status(400).json({ error: err.message || "Failed to run backtest." });
  }
});

function validateRequest(strategy, symbol, timeframe, startDate, endDate) {
  if (!strategy) return "Missing strategy.";
  if (!symbol) return "Symbol is required.";
  if (!timeframe) return "Timeframe is required.";
  if (!startDate || !endDate) return "startDate and endDate are required.";
  if (new Date(startDate) >= new Date(endDate)) return "startDate must be before endDate.";

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
