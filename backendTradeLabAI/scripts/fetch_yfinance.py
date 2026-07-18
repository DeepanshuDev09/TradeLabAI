import sys
import json
from datetime import datetime, timedelta

import yfinance as yf

# Maps this platform's timeframe values to yfinance's interval strings.
# yfinance has no native "4h" bar, so we fetch 1h and resample.
INTERVAL_MAP = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1h": "60m",
    "4h": "60m",  # resampled below
    "1d": "1d",
}

# Yahoo enforces lookback limits on intraday data, independent of the date
# range you ask for. Surface a clear error instead of silently truncating.
MAX_LOOKBACK_DAYS = {
    "1m": 7,
    "5m": 60,
    "15m": 60,
    "30m": 60,
    "1h": 730,
    "4h": 730,
    "1d": None,  # no limit
}


def resample_to_4h(df):
    agg = {"Open": "first", "High": "max", "Low": "min", "Close": "last", "Volume": "sum"}
    return df.resample("4h").agg(agg).dropna()


def main():
    payload = json.loads(sys.stdin.read())
    symbol = payload["symbol"]
    timeframe = payload["timeframe"]
    start_date = payload["startDate"]
    end_date = payload["endDate"]

    if timeframe not in INTERVAL_MAP:
        print(json.dumps({"error": f"Unsupported timeframe: {timeframe}"}))
        return

    max_days = MAX_LOOKBACK_DAYS[timeframe]
    if max_days is not None:
        start_dt = datetime.fromisoformat(start_date)
        if datetime.utcnow() - start_dt > timedelta(days=max_days):
            print(json.dumps({
                "error": f"Yahoo Finance only provides {max_days} days of history for "
                         f"the {timeframe} timeframe. Pick a more recent start date or use 1d."
            }))
            return

    interval = INTERVAL_MAP[timeframe]

    df = yf.download(
        symbol,
        start=start_date,
        end=end_date,
        interval=interval,
        progress=False,
        auto_adjust=False,
        multi_level_index=False,
    )

    if df.empty:
        print(json.dumps({"error": f"No data returned for {symbol}. Check the symbol/date range."}))
        return

    if timeframe == "4h":
        df = resample_to_4h(df)

    candles = []
    for ts, row in df.iterrows():
        open_time_ms = int(ts.timestamp() * 1000)
        candles.append({
            "open_time": open_time_ms,
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": float(row["Volume"]) if not row["Volume"] != row["Volume"] else 0.0,
            "close_time": open_time_ms,
        })

    print(json.dumps(candles))


if __name__ == "__main__":
    main()
