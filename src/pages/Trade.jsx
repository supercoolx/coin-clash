import { useEffect } from "react";

const Trade = () => {

  useEffect(() => {
    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
    } else {
      createWidget();
    }
  }, []);

  const createWidget = () => {
    new window.TradingView.widget({
      container_id: "tradingview_bnbusdt",
      symbol: "BINANCE:BNBUSDT",
      interval: "D",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      details: true,
      hotlist: true,
      calendar: true,
      width: "100%",
      height: 600,
    });
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-4 pb-[24px] mt-20 px-4">
      <div className="flex-1">
        <div id="tradingview_bnbusdt" style={{ height: "600px", width: "100%" }} />
      </div>
      <div className="">
        <div className="p-4 pr-6 bg-dark-gray rounded-3xl">
          <div className="flex gap-4">
            <img src="/imgs/logo.webp" alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">SuperDawhg (SDOG)</div>
              <div className="font-semibold text-neutral-500">The best dog on CoinClash</div>
            </div>
            <div className="ml-8 font-bold text-primary">#1</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 mt-2 font-bold rounded-full bg-dark-gray">
          <div className="text-primary">market cap: 2.15M</div>
          <div className="flex items-center gap-1">
            <img src="/imgs/user.svg" alt="" className="w-4 h-4" />
            <span>12.508</span>
          </div>
        </div>
        <div className="p-5 mt-2 font-bold bg-dark-gray rounded-3xl">
          <div className="text-neutral-500">654,897,987 SDOG Remaining</div>
          <div className="flex gap-2 p-1 mt-2 border border-white rounded-xl">
            <div className="flex items-center flex-1 px-2">
              <input type="text" className="w-full bg-transparent outline-none" />
            </div>
            <div className="w-12 rounded-full">
              <img src="/imgs/solana.webp" alt="" className="w-12 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500">0.1SOL</button>
            <button className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500">0.5SOL</button>
            <button className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500">1SOL</button>
            <button className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500">5SOL</button>
          </div>
          <div className="mt-5">
            1,500,500 <span className="text-neutral-500">SDOG</span>
          </div>
          <button className="flex items-center justify-center w-full h-8 mt-5 text-sm font-semibold text-black transition-all duration-300 rounded-lg bg-primary hover:bg-secondary hover:text-white">Buy</button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          <img src="/imgs/x.webp" alt="" className="" />
          <img src="/imgs/telegram.webp" alt="" className="" />
        </div>
        <div className="mt-5 font-bold">
          <div className="text-lg text-neutral-500">Token Distribution</div>
          <div className="mt-2">
            <div className="flex justify-between">
              <div className="text-neutral-500">1. Liquidity</div>
              <div className="text-neutral-500">80%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-neutral-500">2. D8xH3 (Dev)</div>
              <div className="text-neutral-500">2%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-neutral-500">3. Ey5U8i</div>
              <div className="text-neutral-500">0.9%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trade;