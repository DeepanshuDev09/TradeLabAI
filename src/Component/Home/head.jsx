import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import ContentHome from "./ContentHome";
import MoreAbout from "./MoreAbout";

const Head = () => {
  const [coins, setCoins] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
            },
          }
        );

        setCoins(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const interval = setInterval(() => {
      container.scrollLeft += 1;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(interval);
  }, [coins]);


  return (
    <div className='bg-all bg-cover bg-center bg-fixed'>

      <div className='flex pb-30 justify-between max-w-[1300px] mx-auto'>
        <div className='flex-col py-40 px-5'>

          <p className='text-gray-400 text-xl font-medium'>UNIFIED BACKTESTING PLATFORM</p>

          <p className='text-3xl text-white font-bold py-4'>Advanced <span className='text-amber-400'>Back-Testing</span> Strategy Platform</p>

          <p className='text-gray-400 text-xl font-medium pb-6 pt-3'>TradeLab-AI is a multi-asset backtesting platform. Make strategy on forex, stocks, and crypto with advanced tools, indicators trusted by numerous traders worldwide.</p>

          <div className='flex items-center gap-3 w-2/3'>
            <button
              onClick={() => navigate("/strategy")}
              className='px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold text-lg whitespace-nowrap hover:bg-amber-300 transition-colors'
            >
              Backtest Your Strategy Now
            </button>
          </div>

          <button
            onClick={() => navigate("/features")}
            className='mt-6 bg-transparent text-white font-medium text-lg px-5 py-2 border border-gray-400 rounded-2xl hover:border-amber-400 hover:text-amber-400 transition-colors'
          >
            Learn More
          </button>

        </div>
        <div className='hidden [@media(min-width:950px)]:flex justify-center'>
          <img className='h-2/3 mt-30 max-w-[500px] flex justify-center' src='https://static.vecteezy.com/system/resources/previews/056/411/658/large_2x/modern-workstation-data-monitoring-analysis-setup-free-png.png' />
        </div>

      </div>
      <div
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar whitespace-nowrap py-5"
      >
        <div className="flex gap-4 w-max">
          {[...coins, ...coins].map((coin, index) => (
            <div
              key={index}
              className="min-w-[180px] flex gap-2 p-4 cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
            >
              <img className="w-5 h-5 rounded-full mt-0.5" src={coin.image} />
              <h2 className="text-white font-bold uppercase">
                {coin.symbol}
              </h2>

              <p className="text-gray-300">
                ${coin.current_price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ContentHome />
      <MoreAbout />
    </div>
  )
}

export default Head;