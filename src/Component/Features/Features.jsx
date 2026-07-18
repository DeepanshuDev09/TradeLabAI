import React from "react";

const Features = () => {
  return (
    <div className="bg-black text-gray-100 min-h-screen">
      {/* HERO */}
      <div className="px-[8vw] pt-20 pb-16 text-center">
        <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">
          Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
          Everything you need to <span className="text-amber-400">research, build, and test</span> a strategy
        </h1>
        <p className="text-zinc-400 text-[17px] max-w-2xl mx-auto">
          From live market data to AI-generated Python strategies, TradeLab AI keeps every step
          of the process — research, backtest, and risk analysis — in one place.
        </p>
      </div>

      {/* CORE FEATURE GRID */}
      <section className="px-[8vw] pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
          <FeatureCard
            title="Multi-Market Data"
            desc="Pull live candle data from Binance for crypto (including gold-backed pairs like PAXGUSDT), and from Yahoo Finance for stocks and forex — all through one unified interface."
            icon={
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 0v20M2 12h20" />
            }
          />
          <FeatureCard
            title="AI Strategy Builder"
            desc="Describe a strategy in plain English and get back a runnable Python function. No coding required — just explain the entry and exit rules you want tested."
            icon={<path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z" />}
          />
          <FeatureCard
            title="Manual Strategy Builder"
            desc="Configure indicator-based strategies — EMA Crossover, RSI, MACD, Bollinger Bands — with custom parameters and risk settings, no code at all."
            icon={<path d="M4 19V5M4 19h16M4 15l4-4 3 3 5-6" />}
          />
          <FeatureCard
            title="Sandboxed Execution"
            desc="AI-generated and uploaded Python strategies run in a locked-down subprocess — no file access, no network calls, no process spawning. Your code, safely isolated."
            icon={<path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Zm0 5v6" />}
          />
          <FeatureCard
            title="Long & Short Support"
            desc="Backtest strategies that trade both directions, with per-trade dynamic stop-loss and take-profit levels computed from price action — not just a flat percentage."
            icon={<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />}
          />
          <FeatureCard
            title="Session & Day Filters"
            desc="Restrict strategies to specific trading sessions (like New York 2pm–10pm) or exclude certain weekdays, with proper timezone and DST handling built in."
            icon={<path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}
          />
          <FeatureCard
            title="Full Backtest Analytics"
            desc="Every run reports win rate, total return, max drawdown, and profit factor, plus a full equity curve and trade-by-trade breakdown."
            icon={<path d="M4 19V5M4 19h16M4 15l4-4 3 3 5-6" />}
          />
          <FeatureCard
            title="Local-First Storage"
            desc="Saved strategies live in your browser's localStorage. Nothing is sent anywhere until you actually run a backtest."
            icon={<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />}
          />
          <FeatureCard
            title="Upload or Edit Code"
            desc="Bring your own .py strategy file, or edit AI-generated code directly before saving — full control over the logic that gets backtested."
            icon={<path d="M12 2v14m0-14 4 4m-4-4-4 4M4 20h16" />}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-[8vw] pb-20">
        <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">
          How it works
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-12">
          Three steps from idea to <span className="text-amber-400">tested strategy</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            number="01"
            title="Describe or configure"
            desc="Write your strategy in plain English, upload a Python file, or configure a built-in indicator with custom parameters."
          />
          <StepCard
            number="02"
            title="Save it locally"
            desc="Name it and it's saved to your browser. Come back anytime — build a whole library of strategies to compare."
          />
          <StepCard
            number="03"
            title="Backtest against real data"
            desc="Pick a symbol, timeframe, and date range across crypto, stocks, or forex, and see exactly how it would have performed."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-[8vw] pb-20">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2.5">
              Ready to build your first strategy?
            </h2>
            <p className="text-zinc-400 text-[15px]">
              No account required to start — everything runs locally until you hit backtest.
            </p>
          </div>
          <div className="flex gap-3.5 flex-shrink-0">
            <button className="px-7 py-3.5 rounded-[10px] font-semibold text-sm bg-amber-400 text-black whitespace-nowrap hover:bg-amber-300 transition-colors">
              Start Building
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {icon}
        </svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-8">
      <div className="font-mono text-3xl font-bold text-amber-400 mb-4">{number}</div>
      <h3 className="text-lg font-bold mb-2.5">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}

export default Features;