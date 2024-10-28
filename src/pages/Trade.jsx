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
      theme: "light",
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
        <div className="bg-dark-gray p-4 pr-6 rounded-3xl">
          <div className="flex gap-4">
            <img src="/imgs/logo.webp" alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">SuperDawhg (SDOG)</div>
              <div className="text-neutral-500 font-semibold">The best dog on CoinClash</div>
            </div>
            <div className="text-primary font-bold ml-8">#1</div>
          </div>
        </div>
        <div className="rounded-full mt-2 px-4 flex justify-between items-center py-2 font-bold bg-dark-gray">
          <div className="text-primary">market cap: 2.15M</div>
          <div className="flex items-center gap-1">
            <img src="/imgs/user.svg" alt="" className="w-4 h-4" />
            <span>12.508</span>
          </div>
        </div>
        <div className="bg-dark-gray rounded-3xl p-5 mt-2 font-bold">
          <div className="text-neutral-500">654,897,987 SDOG Remaining</div>
          <div className="border border-white rounded-xl flex gap-2 p-1 mt-2">
            <div className="flex-1 flex items-center px-2">
              <input type="text" className="w-full outline-none bg-transparent" />
            </div>
            <div className="w-12 rounded-full">
              <img src="/imgs/solana.webp" alt="" className="w-12 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="bg-neutral-800 w-16 h-6 rounded-lg text-neutral-500">0.1SOL</button>
            <button className="bg-neutral-800 w-16 h-6 rounded-lg text-neutral-500">0.5SOL</button>
            <button className="bg-neutral-800 w-16 h-6 rounded-lg text-neutral-500">1SOL</button>
            <button className="bg-neutral-800 w-16 h-6 rounded-lg text-neutral-500">5SOL</button>
          </div>
          <div className="mt-5">
            1,500,500 <span className="text-neutral-500">SDOG</span>
          </div>
          <button className="w-full rounded-lg bg-primary flex items-center justify-center text-black text-sm h-8 transition-all duration-300 font-semibold hover:bg-secondary hover:text-white mt-5">Buy</button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          <img src="/imgs/x.webp" alt="" className="" />
          <img src="/imgs/telegram.webp" alt="" className="" />
        </div>
        <div className="mt-5 font-bold">
          <div className="text-neutral-500 text-lg">Token Distribution</div>
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