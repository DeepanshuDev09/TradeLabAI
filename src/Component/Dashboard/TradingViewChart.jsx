import { useEffect, useRef } from "react";

const TradingViewChart = ({ symbol }) => {
  const container = useRef(null);

  useEffect(() => {
    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container w-full h-[600px]">
      <div
        ref={container}
        className="tradingview-widget-container__widget w-full h-full"
      />
    </div>
  );
};

export default TradingViewChart;