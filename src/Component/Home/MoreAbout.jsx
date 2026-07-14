import React from 'react'

const MoreAbout = () => {
  return (
    <div className='text-white max-w-[1300px] mx-auto'>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-zinc-800 px-[8vw] py-14 mt-20">
  <div className="text-left md:border-l md:first:border-l-0 border-zinc-800 md:pl-6 md:first:pl-0">
    <div className="font-mono text-3xl md:text-4xl font-bold">50K+</div>
    <div className="text-zinc-400 text-xs mt-1.5 tracking-wide">Active traders</div>
  </div>
  <div className="text-left md:border-l border-zinc-800 md:pl-6">
    <div className="font-mono text-3xl md:text-4xl font-bold">200+</div>
    <div className="text-zinc-400 text-xs mt-1.5 tracking-wide">Built-in indicators</div>
  </div>
  <div className="text-left md:border-l border-zinc-800 md:pl-6">
    <div className="font-mono text-3xl md:text-4xl font-bold ">15</div>
    <div className="text-zinc-400 text-xs mt-1.5 tracking-wide">Markets covered</div>
  </div>
  <div className="text-left md:border-l border-zinc-800 md:pl-6">
    <div className="font-mono text-3xl md:text-4xl font-bold">99.9%</div>
    <div className="text-zinc-400 text-xs mt-1.5 tracking-wide">Platform uptime</div>
  </div>
</div>


<section className="px-[8vw] py-24">
  <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">Platform</div>
  <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight leading-tight mb-4">
    Everything a strategy needs,<br/>in <span className="text-amber-400">one workspace</span>
  </h2>
  <p className="text-zinc-400 text-[17px] max-w-xl mb-14">From raw price data to a live-tested strategy, TradeLab AI keeps every step — research, backtest, and execution — under one roof.</p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">Multi-Asset Backtesting</h3>
      <p className="text-zinc-400 text-sm">Test strategies across forex, equities, and crypto using the same rules engine, side by side, without switching tools.</p>
    </div>
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l7 7"/></svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">AI Strategy Builder</h3>
      <p className="text-zinc-400 text-sm">Describe a setup in plain language and TradeLab AI drafts the entry, exit, and risk rules you can refine and run instantly.</p>
    </div>
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V5M4 19h16M4 15l4-4 3 3 5-6"/></svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">200+ Live Indicators</h3>
      <p className="text-zinc-400 text-sm">EMA, RSI, MACD, order-flow, and custom scripts — layer indicators directly on the chart while you build a strategy.</p>
    </div>
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z"/></svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">Risk Analytics</h3>
      <p className="text-zinc-400 text-sm">Drawdown, win-rate, Sharpe ratio, and exposure breakdowns are calculated automatically on every backtest run.</p>
    </div>
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/></svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">One-Click Execution</h3>
      <p className="text-zinc-400 text-sm">Move a validated strategy from backtest to a connected broker or exchange without rewriting a single rule.</p>
    </div>
    <div className="bg-zinc-900 p-8 hover:bg-zinc-800/60 transition-colors">
      <div className="w-11 h-11 rounded-[10px] bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-5 text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
      </div>
      <h3 className="text-lg font-bold mb-2.5">Custom Alerts</h3>
      <p className="text-zinc-400 text-sm">Set price, indicator, or strategy-condition alerts and get notified the moment a setup you defined actually triggers.</p>
    </div>
  </div>
</section>


<section className="px-[8vw] py-24">
  <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
    <div>
      <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">Indicators</div>
      <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight leading-tight mb-4">
        Built on the signals<br/>traders <span className="text-amber-400">already trust</span>
      </h2>
      <p className="text-zinc-400 text-[17px] max-w-xl mb-9">Stack indicators on any timeframe and see how they would have performed together, before risking real capital.</p>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-5 py-4 border border-amber-400/40 bg-amber-400/5 rounded-xl">
          <div className="flex items-center gap-3.5 font-semibold text-[15px]">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>EMA Crossover
          </div>
          <div className="font-mono text-[11px] text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full">TREND</div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border border-zinc-800 bg-zinc-900 rounded-xl">
          <div className="flex items-center gap-3.5 font-semibold text-[15px]">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>RSI Divergence
          </div>
          <div className="font-mono text-[11px] text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full">MOMENTUM</div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border border-zinc-800 bg-zinc-900 rounded-xl">
          <div className="flex items-center gap-3.5 font-semibold text-[15px]">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>MACD Histogram
          </div>
          <div className="font-mono text-[11px] text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full">MOMENTUM</div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border border-zinc-800 bg-zinc-900 rounded-xl">
          <div className="flex items-center gap-3.5 font-semibold text-[15px]">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>Bollinger Bands
          </div>
          <div className="font-mono text-[11px] text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full">VOLATILITY</div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border border-zinc-800 bg-zinc-900 rounded-xl">
          <div className="flex items-center gap-3.5 font-semibold text-[15px]">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>Volume Profile
          </div>
          <div className="font-mono text-[11px] text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full">VOLUME</div>
        </div>
      </div>
    </div>

    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-6">
      <div className="flex justify-between items-center mb-5 text-zinc-400 text-xs">
        <span className="font-mono">BTCUSDT · 1H</span>
        <span className="font-mono text-emerald-500">+2.4%</span>
      </div>
      <div className="h-44 rounded-[10px] bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
        <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="w-full h-full block">
          <polyline points="0,120 20,110 40,130 60,100 80,105 100,80 120,90 140,60 160,70 180,50 200,55 220,40 240,55 260,45 280,65 300,50 320,70 340,60 360,80 380,65 400,75"
            fill="none" stroke="#fbbf24" strokeWidth="2"/>
          <polyline points="0,140 20,135 40,145 60,125 80,128 100,112 120,118 140,95 160,100 180,85 200,88 220,78 240,88 260,82 280,95 300,86 320,98 340,92 360,105 380,95 400,100"
            fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6"/>
        </svg>
      </div>
      <div className="flex justify-between mt-4 text-xs font-mono">
        <span className="text-zinc-400">Win rate</span>
        <span className="text-teal-400">64.2%</span>
      </div>
      <div className="flex justify-between mt-2 text-xs font-mono">
        <span className="text-zinc-400">Max drawdown</span>
        <span className="text-rose-500">-8.1%</span>
      </div>
    </div>
  </div>
</section>


<section className="px-[8vw] py-24">
  <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">Trusted worldwide</div>
  <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight leading-tight mb-4">
    What traders are <span className="text-amber-400">saying</span>
  </h2>
  <p className="text-zinc-400 text-[17px] max-w-xl mb-14">Real feedback from traders who moved their strategy testing onto TradeLab AI.</p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-8">
      <div className="text-amber-400 text-[13px] mb-3.5 tracking-widest">★★★★★</div>
      <p className="text-gray-300 text-[15px] mb-6">I stopped guessing win rates in a spreadsheet and started seeing them on the chart. Cut my strategy testing time in half.</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-teal-400"></div>
        <div>
          <div className="font-semibold text-sm">Arjun Mehta</div>
          <div className="text-zinc-400 text-xs">Swing trader, forex</div>
        </div>
      </div>
    </div>
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-8">
      <div className="text-amber-400 text-[13px] mb-3.5 tracking-widest">★★★★★</div>
      <p className="text-gray-300 text-[15px] mb-6">Being able to run the same EMA strategy on crypto and equities side by side changed how I size positions across both.</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-teal-400"></div>
        <div>
          <div className="font-semibold text-sm">Sofia Reyes</div>
          <div className="text-zinc-400 text-xs">Quant researcher</div>
        </div>
      </div>
    </div>
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-8">
      <div className="text-amber-400 text-[13px] mb-3.5 tracking-widest">★★★★★</div>
      <p className="text-gray-300 text-[15px] mb-6">The one-click execution bridge is what sold me. My backtested rules go live without me rebuilding anything.</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-teal-400"></div>
        <div>
          <div className="font-semibold text-sm">Daniel Cho</div>
          <div className="text-zinc-400 text-xs">Day trader, equities</div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="px-[8vw] py-24">
  <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4">Pricing</div>
  <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight leading-tight mb-4">
    Start free, <span className="text-amber-400">scale when ready</span>
  </h2>
  <p className="text-zinc-400 text-[17px] max-w-xl mb-14">Every plan includes core backtesting. Upgrade for more history, more indicators, and live execution.</p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-9 relative">
      <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2.5">Starter</div>
      <div className="font-mono text-4xl font-bold mb-1">$0<span className="text-base text-zinc-400 font-normal">/mo</span></div>
      <div className="text-zinc-400 text-sm mb-6">For traders testing their first strategies.</div>
      <ul className="flex flex-col gap-2.5 mb-7 text-sm text-gray-300">
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>3 saved strategies</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>1 year of historical data</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>20 core indicators</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Daily timeframe backtests</li>
      </ul>
      <button className="w-full py-3 rounded-[10px] font-semibold text-sm border border-zinc-800 hover:bg-zinc-800/60 transition-colors">Get started</button>
    </div>

    <div className="border border-amber-400 rounded-2xl p-9 relative bg-zinc-900">
      <div className="absolute -top-px right-6 bg-amber-400 text-black text-[11px] font-bold px-3 py-1 rounded-b-lg tracking-wide">MOST POPULAR</div>
      <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2.5">Pro</div>
      <div className="font-mono text-4xl font-bold mb-1">$29<span className="text-base text-zinc-400 font-normal">/mo</span></div>
      <div className="text-zinc-400 text-sm mb-6">For active traders running multiple strategies.</div>
      <ul className="flex flex-col gap-2.5 mb-7 text-sm text-gray-300">
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Unlimited saved strategies</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>10 years of historical data</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>200+ indicators</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Intraday down to 1 minute</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Custom alerts</li>
      </ul>
      <button className="w-full py-3 rounded-[10px] font-semibold text-sm bg-amber-400 text-black hover:bg-amber-300 transition-colors">Start free trial</button>
    </div>

    <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-9 relative">
      <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2.5">Institutional</div>
      <div className="font-mono text-4xl font-bold mb-1">Custom</div>
      <div className="text-zinc-400 text-sm mb-6">For desks and funds with execution needs.</div>
      <ul className="flex flex-col gap-2.5 mb-7 text-sm text-gray-300">
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Everything in Pro</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Broker & exchange execution</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Dedicated data feed</li>
        <li className="flex gap-2.5"><span className="text-teal-400 font-bold">✓</span>Priority support</li>
      </ul>
      <button className="w-full py-3 rounded-[10px] font-semibold text-sm border border-zinc-800 hover:bg-zinc-800/60 transition-colors">Contact sales</button>
    </div>
  </div>
</section>


<section className="px-[8vw] pb-4">
  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
    <div className="text-center md:text-left">
      <h2 className="text-2xl md:text-[32px] font-extrabold mb-2.5">Ready to test your first strategy?</h2>
      <p className="text-zinc-400 text-[15px]">No credit card required. Backtest your first idea in under five minutes.</p>
    </div>
    <div className="flex gap-3.5 flex-shrink-0">
      <button className="px-7 py-3.5 rounded-[10px] font-semibold text-sm bg-amber-400 text-black whitespace-nowrap hover:bg-amber-300 transition-colors">Start Free</button>
      <button className="px-7 py-3.5 rounded-[10px] font-semibold text-sm border border-zinc-800 whitespace-nowrap hover:bg-zinc-800/60 transition-colors">Watch Demo</button>
    </div>
  </div>
</section>


<footer className="px-[8vw] pt-16 pb-8 border-t border-zinc-800 mt-16">
  <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12">
    <div className="col-span-2">
      <div className="text-xl font-extrabold mb-3.5">TradeLab <span className="text-amber-400">AI</span></div>
      <p className="text-zinc-400 text-[13.5px] max-w-xs">A unified backtesting and strategy platform for forex, stocks, and crypto — trusted by traders worldwide.</p>
    </div>
    <div>
      <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-4">Product</h4>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Back-Testing</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Indicators</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Features</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Pricing</a>
    </div>
    <div>
      <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-4">Resources</h4>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Documentation</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">API Reference</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Strategy Library</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Blog</a>
    </div>
    <div>
      <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-4">Company</h4>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">About</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Careers</a>
      <a href="#" className="block text-gray-300 text-sm mb-3 hover:text-amber-400 transition-colors">Contact</a>
    </div>
  </div>
  <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row justify-between gap-2 text-zinc-400 text-[13px]">
    <span>© 2026 TradeLab AI. All rights reserved.</span>
    <span>Trading involves risk. Past backtest performance does not guarantee future results.</span>
  </div>
</footer>
    </div>
  )
}

export default MoreAbout