import React from "react";

const About = () => {
  return (
    <div className="bg-black text-gray-100 min-h-screen">
      {/* HERO */}
      <div className="px-[8vw] pt-20 pb-16">
        <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">
          About
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5 max-w-3xl">
          Backtesting shouldn't require <span className="text-amber-400">a quant degree</span>
        </h1>
        <p className="text-zinc-400 text-[17px] max-w-2xl">
          TradeLab AI is a unified backtesting platform for forex, stocks, and crypto — built so
          anyone with a trading idea can test it against real historical data, whether they can
          code or not.
        </p>
      </div>

      {/* MISSION */}
      <section className="px-[8vw] pb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Why we built this</h2>
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-4">
            Most retail traders test ideas by eyeballing a chart or, at best, tracking trades in
            a spreadsheet. Meanwhile, real backtesting tools are either locked behind
            professional platforms or require writing code from scratch in a language you may
            not know.
          </p>
          <p className="text-zinc-400 text-[15px] leading-relaxed">
            TradeLab AI closes that gap: describe a strategy in plain English, or configure a
            classic indicator with a few clicks, and get a real backtest — win rate, drawdown,
            equity curve, trade-by-trade breakdown — against actual market data.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">What makes it different</h2>
          <ul className="flex flex-col gap-4">
            <AboutPoint text="AI converts a plain-English description into a runnable Python strategy — no coding background needed." />
            <AboutPoint text="Every AI-generated or uploaded strategy runs in a locked-down sandbox: no file access, no network calls, no process spawning." />
            <AboutPoint text="One platform for crypto, stocks, and forex, instead of stitching together three different tools." />
            <AboutPoint text="Strategies are saved locally in your browser — nothing leaves your machine until you run a backtest." />
          </ul>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="px-[8vw] pb-16">
        <h2 className="text-2xl font-bold mb-6">Built with</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TechCard label="React" sub="Frontend" />
          <TechCard label="Tailwind CSS" sub="Styling" />
          <TechCard label="Node.js / Express" sub="Backend API" />
          <TechCard label="Python" sub="Sandboxed strategy execution" />
          <TechCard label="Binance API" sub="Crypto market data" />
          <TechCard label="Yahoo Finance" sub="Stock & forex data" />
          <TechCard label="OpenRouter" sub="AI strategy generation" />
          <TechCard label="localStorage" sub="Strategy persistence" />
        </div>
      </section>

      {/* ROADMAP */}
      <section className="px-[8vw] pb-16">
        <h2 className="text-2xl font-bold mb-6">What's next</h2>
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900 divide-y divide-zinc-800">
          <RoadmapRow text="Portfolio-level backtests across multiple strategies at once" status="Planned" />
          <RoadmapRow text="Optional account sync, so strategies aren't tied to one browser" status="Planned" />
          <RoadmapRow text="Live paper-trading mode" status="Exploring" />
          <RoadmapRow text="Commission and slippage modeling for more realistic returns" status="In progress" />
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="px-[8vw] pb-20">
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-8">
          <h2 className="text-lg font-bold mb-3">A quick disclaimer</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            TradeLab AI is a research and educational tool. Backtest results are based on
            historical data and simulated fills — they don't account for real-world slippage,
            fees, or execution delays, and past performance never guarantees future results.
            Nothing on this platform constitutes financial advice.
          </p>
        </div>
      </section>
    </div>
  );
};

function AboutPoint({ text }) {
  return (
    <li className="flex gap-3 text-sm text-zinc-300">
      <span className="text-teal-400 font-bold flex-shrink-0">✓</span>
      {text}
    </li>
  );
}

function TechCard({ label, sub }) {
  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-zinc-400 text-xs mt-1">{sub}</div>
    </div>
  );
}

function RoadmapRow({ text, status }) {
  const statusColor =
    status === "In progress"
      ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
      : status === "Exploring"
      ? "text-teal-400 border-teal-400/30 bg-teal-400/10"
      : "text-zinc-400 border-zinc-700 bg-zinc-800/50";

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm text-gray-200">{text}</span>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}

export default About;