import React, { useState, useEffect } from "react";
import TradingViewChart from "./TradingViewChart";
import axios from "axios";

const STRATEGY_STORAGE_KEY = "ai_generated_strategies";

const Terminal = () => {
  const [stats, setStats] = useState();
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [savedStrategies, setSavedStrategies] = useState([]);
  const [strategyId, setStrategyId] = useState("");

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

  const handleFetch = async () => {
    if (!selectedStrategy) {
      alert("Select a saved strategy first (create one in the AI Strategy Builder).");
      return;
    }

    const config = {
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

    const response = await axios.post(
      "http://localhost:5000/api/backtest",
      config
    );

    const candles = response.data.candles || [];

    setStats({
      count: candles.length,
      first: new Date(candles[0][0]).toLocaleDateString(),
      last: new Date(candles[candles.length - 1][0]).toLocaleDateString(),
    });

    console.log(response.data.candles);
  };

  return (
    <div
      className="bg-all min-h-screen bg-cover bg-center bg-fixed text-white"
    >
      <h1 className="text-4xl font-bold text-center py-12">
        Backtest Configuration
      </h1>

      <div className="flex flex-col xl:flex-row gap-6 px-4 md:px-8 pb-8">

        <div className="w-[350px] border border-gray-500 rounded-xl p-6 bg-black/30 backdrop-blur-md shadow-lg">

          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTCUSDT"
              className="w-full bg-transparent border border-gray-400 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
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
            onClick={handleFetch}
            disabled={savedStrategies.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fetch Data
          </button>
        </div>

        <div className="flex-1 border border-gray-500 rounded-xl overflow-hidden bg-black/20 backdrop-blur-md shadow-lg">
          <TradingViewChart symbol={symbol} />
        </div>
      </div>
      {stats && (
        <div className="px-8 mt-6 grid md:grid-cols-4 gap-5">

          <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400">Candles</p>
            <h2 className="text-3xl font-bold">{stats.count}</h2>
          </div>

          <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400">First Candle</p>
            <h2 className="text-xl">{stats.first}</h2>
          </div>

          <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400">Last Candle</p>
            <h2 className="text-xl">{stats.last}</h2>
          </div>

          <div className="bg-[#161b22] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400">Status</p>
            <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-green-600">
              Ready
            </span>
          </div>

        </div>
      )}
    </div>



  );
};

export default Terminal;