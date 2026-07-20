import React, { useState, useEffect } from "react";
import TradingViewChart from "./TradingViewChart";
import axios from "axios";
import { useSearchParams } from "react-router";

const STRATEGY_STORAGE_KEY = "ai_generated_strategies";

const MARKET_OPTIONS = [
  { value: "crypto", label: "Crypto (Binance)" },
  { value: "stocks", label: "Stocks (Yahoo Finance)" },
  { value: "forex", label: "Forex (Yahoo Finance)" },
];

const QUICK_SYMBOLS = {
  crypto: [
    { label: "BTC/USDT", value: "BTCUSDT" },
    { label: "ETH/USDT", value: "ETHUSDT" },
    { label: "Gold (PAXG/USDT)", value: "PAXGUSDT" },
    { label: "Gold (XAUT/USDT)", value: "XAUTUSDT" },
  ],
  stocks: [
    { label: "Apple", value: "AAPL" },
    { label: "Tesla", value: "TSLA" },
    { label: "NVIDIA", value: "NVDA" },
  ],
  forex: [
    { label: "EUR/USD", value: "EURUSD=X" },
    { label: "GBP/USD", value: "GBPUSD=X" },
    { label: "USD/JPY", value: "USDJPY=X" },
  ],
};

const Terminal = () => {
  const [market, setMarket] = useState("crypto");
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState(searchParams.get("symbol") || "BTCUSDT");

  useEffect(() => {
    const paramSymbol = searchParams.get("symbol");
    if (paramSymbol) setSymbol(paramSymbol.toUpperCase());
  }, [searchParams]);
  const [timeframe, setTimeframe] = useState("1h");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [savedStrategies, setSavedStrategies] = useState([]);
  const [strategyId, setStrategyId] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { stats, trades, equityCurve, candleCount }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STRATEGY_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setSavedStrategies(list);
      if (list.length > 0) setStrategyId(list[0].id);
    } catch {
      setSavedStrategies([]);
    }
  }, []);

  const selectedStrategy = savedStrategies.find((s) => s.id === strategyId);

  const handleMarketChange = (newMarket) => {
    setMarket(newMarket);
    // jump the symbol to a sensible default for the new market
    setSymbol(QUICK_SYMBOLS[newMarket][0].value);
  };

  const handleRunBacktest = async () => {
    if (!selectedStrategy) {
      setError("Select a saved strategy first (create one in the AI Strategy Builder).");
      return;
    }
    if (!startDate || !endDate) {
      setError("Pick a start and end date.");
      return;
    }

    setError("");
    setResult(null);
    setIsRunning(true);

    const config = {
      market,
      symbol,
      timeframe,
      startDate,
      endDate,
      strategy: {
        id: selectedStrategy.id,
        name: selectedStrategy.name,
        code: selectedStrategy.code,
      },
    };

    try {
      const response = await axios.post(
        "https://tradelabai.onrender.com/api/backtest",
        config
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Backtest failed. Check the console for details.");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className="bg-all min-h-screen bg-cover bg-center bg-fixed text-white"
    >
      <h1 className="text-4xl font-bold text-center py-12">
        Backtest Configuration
      </h1>

      <div className="flex gap-6 px-8 pb-8">

        <div className="w-[350px] border border-gray-500 rounded-xl p-6 bg-black/30 backdrop-blur-md shadow-lg">

          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">Market</label>
            <select
              value={market}
              onChange={(e) => handleMarketChange(e.target.value)}
              className="w-full bg-black border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            >
              {MARKET_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTCUSDT"
              className="w-full bg-transparent border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {QUICK_SYMBOLS[market].map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setSymbol(q.value)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    symbol === q.value
                      ? "border-blue-500 text-blue-400 bg-blue-500/10"
                      : "border-gray-600 text-gray-400 hover:border-gray-400"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
            {market !== "crypto" && (
              <p className="text-xs text-gray-500 mt-2">
                {market === "forex"
                  ? 'Forex pairs need the "=X" suffix, e.g. EURUSD=X'
                  : "Use the plain ticker symbol, e.g. AAPL"}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-black border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            >
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="30m">30 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-lg font-medium">
              Strategy
            </label>

            {savedStrategies.length === 0 ? (
              <div className="w-full border border-gray-400 rounded-lg px-4 py-3 text-sm text-gray-400">
                No saved strategies yet. Create one in the AI Strategy Builder first.
              </div>
            ) : (
              <select
                value={strategyId}
                onChange={(e) => setStrategyId(e.target.value)}
                className="w-full bg-black border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
              >
                {savedStrategies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {selectedStrategy && (
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                {selectedStrategy.description}
              </p>
            )}
          </div>

          <button
            onClick={handleRunBacktest}
            disabled={savedStrategies.length === 0 || isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? "Running backtest..." : "Run Backtest"}
          </button>

          {error && (
            <div className="mt-4 border border-red-500/40 bg-red-500/10 text-red-400 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 border border-gray-500 rounded-xl overflow-hidden bg-black/20 backdrop-blur-md shadow-lg">
          <TradingViewChart symbol={symbol} />
        </div>
      </div>

      {result && (
        <div className="px-8 pb-12">
          <div className="grid md:grid-cols-4 gap-5 mb-6">
            <StatCard
              label="Total Return"
              value={`${result.stats.totalReturnPercent >= 0 ? "+" : ""}${result.stats.totalReturnPercent.toFixed(2)}%`}
              accent={result.stats.totalReturnPercent >= 0 ? "text-green-400" : "text-red-400"}
            />
            <StatCard label="Win Rate" value={`${result.stats.winRate.toFixed(1)}%`} />
            <StatCard label="Total Trades" value={result.stats.totalTrades} />
            <StatCard
              label="Max Drawdown"
              value={`-${result.stats.maxDrawdownPercent.toFixed(1)}%`}
              accent="text-red-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <StatCard label="Profit Factor" value={result.stats.profitFactor === null ? "∞" : result.stats.profitFactor.toFixed(2)} />
            <StatCard label="Candles Analyzed" value={result.candleCount} />
          </div>

          <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 mb-3">Equity Curve</p>
            <EquityCurve equityCurve={result.equityCurve} />
          </div>

          {result.trades.length > 0 && (
            <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700 mt-6 overflow-x-auto">
              <p className="text-gray-400 mb-3">Trades</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-700">
                    <th className="pb-2 pr-4">Entry</th>
                    <th className="pb-2 pr-4">Exit</th>
                    <th className="pb-2 pr-4">Entry Price</th>
                    <th className="pb-2 pr-4">Exit Price</th>
                    <th className="pb-2 pr-4">P&L %</th>
                    <th className="pb-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.map((t, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-2 pr-4">{new Date(t.entryTime).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{new Date(t.exitTime).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{t.entryPrice.toFixed(2)}</td>
                      <td className="py-2 pr-4">{t.exitPrice.toFixed(2)}</td>
                      <td className={`py-2 pr-4 ${t.pnlPercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.pnlPercent >= 0 ? "+" : ""}
                        {t.pnlPercent.toFixed(2)}%
                      </td>
                      <td className="py-2 capitalize">{t.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function StatCard({ label, value, accent = "" }) {
  return (
    <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700">
      <p className="text-gray-400">{label}</p>
      <h2 className={`text-3xl font-bold ${accent}`}>{value}</h2>
    </div>
  );
}

function EquityCurve({ equityCurve }) {
  if (!equityCurve || equityCurve.length < 2) {
    return <p className="text-gray-500 text-sm">Not enough data points to plot.</p>;
  }

  const values = equityCurve.map((p) => p.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = 800 / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = 180 - ((v - min) / range) * 160 - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isProfit = values[values.length - 1] >= values[0];

  return (
    <svg viewBox="0 0 800 180" preserveAspectRatio="none" className="w-full h-48">
      <polyline
        points={points}
        fill="none"
        stroke={isProfit ? "#4ade80" : "#f87171"}
        strokeWidth="2"
      />
    </svg>
  );
}

export default Terminal;
