# TradeLab AI

**Live app:** [trade-lab-ai.vercel.app](https://trade-lab-ai.vercel.app)

A unified backtesting and strategy platform for forex, stocks, and crypto. Pull live candle data from Binance, build and save trading strategies, and backtest them — including strategies described in plain English and converted to code by AI.

---

## Features

- **Multi-asset candle data** — fetches live OHLCV candles from the Binance API for any symbol and timeframe (1m–1d).
- **TradingView-style charting** — interactive price chart with symbol switching.
- **Manual strategy builder** — configure indicator-based strategies (EMA Crossover, RSI, MACD, Bollinger Bands) with custom parameters and risk settings (position size, stop-loss, take-profit).
- **AI Strategy Builder** — describe a strategy in plain English (e.g. *"buy when RSI drops below 30 and recovers, sell above 70"*) and get back a runnable Python `generate_signals()` function, powered by a free LLM via OpenRouter.
- **Local-first strategy storage** — saved strategies live in the browser's `localStorage`; nothing is sent anywhere until you run a backtest.
- **Backtest engine** — simulates trades against historical candles and reports win rate, total return, max drawdown, and profit factor.

---

## Tech stack

**Frontend**
- React
- Tailwind CSS
- Axios
- TradingView widget/chart component

**Backend**
- Node.js + Express
- Binance public REST API (candle data)
- OpenRouter API (free LLM inference for the AI Strategy Builder)

**Deployment**
- Frontend: Vercel
- Backend: Node/Express server (see `.env` setup below)

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/trade-lab-ai.git
cd trade-lab-ai
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
APP_URL=http://localhost:3000
```

Get a free OpenRouter key at [openrouter.ai/keys](https://openrouter.ai/keys) — no credit card required.

Start the backend:

```bash
node app.js
```

The API runs on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000`.

---

## API reference

### `POST /api/backtest`
Runs a backtest against live Binance candle data.

```json
{
  "symbol": "BTCUSDT",
  "timeframe": "1h",
  "startDate": "2026-01-01",
  "endDate": "2026-06-01",
  "strategy": { "id": "...", "name": "...", "code": "..." }
}
```

### `POST /api/generate-strategy`
Converts a plain-English strategy description into a Python `generate_signals(candles)` function.

```json
{
  "description": "Buy when the 9 EMA crosses above the 21 EMA. Sell when it crosses back below."
}
```

Returns:

```json
{ "code": "def generate_signals(candles):\n    ..." }
```

---

## Project structure

```
trade-lab-ai/
├── backend/
│   ├── app.js
│   ├── routes/
│   │   ├── backtest.js
│   │   └── generateStrategy.js
│   └── services/
│       ├── binanceService.js
│       ├── indicators.js
│       └── backtestEngine.js
└── frontend/
    └── src/
        ├── Terminal.jsx
        ├── StrategyManager.jsx
        ├── AIStrategyBuilder.jsx
        └── TradingViewChart.jsx
```

---

## Roadmap

- [ ] Sandbox execution of AI-generated Python strategies against live candle data
- [ ] Short-selling support in the backtest engine
- [ ] Multi-strategy portfolio backtests
- [ ] Persist strategies to a database (optional account sync, beyond localStorage)
- [ ] Live paper-trading mode

---

## Disclaimer

TradeLab AI is a research and educational tool. Backtest results are based on historical data and do not guarantee future performance. Nothing in this project constitutes financial advice.

## License

MIT
