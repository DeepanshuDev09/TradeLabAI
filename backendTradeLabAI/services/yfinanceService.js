const { spawn } = require("child_process");
const path = require("path");

const SCRIPT_PATH = path.join(__dirname, "..", "scripts", "fetch_yfinance.py");
const TIMEOUT_MS = 30000;

/**
 * Fetches candles for a stock or forex symbol from Yahoo Finance via yfinance.
 *
 * Symbol format:
 *   - Stocks: plain ticker, e.g. "AAPL", "TSLA"
 *   - Forex:  pair + "=X",   e.g. "EURUSD=X", "GBPJPY=X"
 *
 * Returns candles in the same shape as binanceService.fetchCandles():
 *   { openTime, open, high, low, close, volume, closeTime }
 */
function fetchYFinanceCandles(symbol, timeframe, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", [SCRIPT_PATH]);

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        proc.kill("SIGKILL");
        reject(new Error("Yahoo Finance request timed out after 30s."));
      }
    }, TIMEOUT_MS);

    proc.stdout.on("data", (chunk) => (stdout += chunk));
    proc.stderr.on("data", (chunk) => (stderr += chunk));

    proc.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`Failed to start yfinance fetch: ${err.message}`));
      }
    });

    proc.on("close", (exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);

      if (exitCode !== 0) {
        reject(new Error(stderr.trim() || "yfinance fetch script failed."));
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(stdout.trim());
      } catch {
        reject(new Error(`yfinance script returned invalid JSON:\n${stdout.slice(0, 500)}`));
        return;
      }

      if (parsed && parsed.error) {
        reject(new Error(parsed.error));
        return;
      }

      // Convert snake_case (Python side) back to the camelCase shape used
      // internally everywhere else (matches binanceService.js's output).
      const candles = parsed.map((c) => ({
        openTime: c.open_time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
        closeTime: c.close_time,
      }));

      resolve(candles);
    });

    proc.stdin.write(JSON.stringify({ symbol, timeframe, startDate, endDate }));
    proc.stdin.end();
  });
}

module.exports = { fetchYFinanceCandles };
