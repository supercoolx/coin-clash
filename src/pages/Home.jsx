import { useState } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";

const Renderer = (props) => {
  return (
    <div className="flex justify-center gap-5">
      <div className="space-y-1">
        <div className="text-center text-neutral-500 text-xl font-bold">Hours</div>
        <div className="w-24 sm:w-32 h-[72px] sm:h-24 bg-dark-gray rounded-3xl flex items-center justify-center text-5xl sm:text-7xl font-bold">{ props.hours }</div>
      </div>
      <div className="space-y-1">
        <div className="text-center text-neutral-500 text-xl font-bold">Minutes</div>
        <div className="w-24 sm:w-32 h-[72px] sm:h-24 bg-dark-gray rounded-3xl flex items-center justify-center text-5xl sm:text-7xl font-bold">{ props.minutes }</div>
      </div>
      <div className="space-y-1">
        <div className="text-center text-neutral-500 text-xl font-bold">Seconds</div>
        <div className="w-24 sm:w-32 h-[72px] sm:h-24 bg-dark-gray rounded-3xl flex items-center justify-center text-5xl sm:text-7xl font-bold">{ props.seconds }</div>
      </div>
    </div>
  )
}

const Home = () => {
  const [date] = useState(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="pb-24 container mx-auto px-4">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center font-bold text-3xl mt-8">Time until Clash</div>
        <Countdown date={date} renderer={Renderer} />
        <div className="text-center font-bold text-2xl">$7,654,897 in loser pool</div>
      </div>
      <div className="flex justify-center">
        <Link to="/create" className="rounded-full bg-primary flex items-center justify-center text-black text-sm h-7 transition-all duration-300 font-semibold hover:bg-secondary hover:text-white w-72 mt-24">Create a new coin</Link>
      </div>
      <div className="mt-24">
        <div className="space-y-2">
          <div className="font-bold">Filter on:</div>
          <div className="flex gap-4 flex-wrap">
            <button className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm border-primary hover:bg-secondary hover:border-secondary transition-all duration-200 ease-in-out`}>Top 10</button>
            <button className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm border-transparent hover:bg-secondary hover:border-secondary transition-all duration-200 ease-in-out`}>Creation Time</button>
            <button className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm border-transparent hover:bg-secondary hover:border-secondary transition-all duration-200 ease-in-out`}>Market Cap</button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {new Array(10).fill(0).map((_, key) => <Link to="/trade" key={key} className="bg-dark-gray p-3 pr-6 cursor-pointer rounded-3xl hover:bg-slate-700 transition-all duration-200">
            <div className="flex gap-4">
              <img src="/imgs/logo.webp" alt="" className="w-20 h-20 rounded-full" />
              <div className="">
                <div className="text-xl font-semibold">SuperDawhg <span className="text-primary">(#1)</span></div>
                <div className="text-neutral-600 font-semibold">The best dog on CoinClash</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-primary font-semibold">market cap: 2.15M</div>
              <div className="flex items-center gap-2">
                <img src="/imgs/user.svg" alt="" className="w-4 h-4" />
                <div className="font-bold">12.508</div>
              </div>
            </div>
          </Link>)}
          <div className="flex items-center pl-5 font-bold">
            Load all &gt;
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;