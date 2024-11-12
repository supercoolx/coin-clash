import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { BACKEND_URI } from "../core/constants";
import axios from "axios";
const Renderer = (props) => {
  return (
    <div className="flex justify-center gap-5">
      <div className="space-y-1">
        <div className="text-xl font-bold text-center text-neutral-500">Days</div>
        <div className="w-24 sm:w-32 h-[72px] sm:h-24 bg-dark-gray rounded-3xl flex items-center justify-center text-5xl sm:text-7xl font-bold">{ props.days }</div>
      </div>
      <div className="space-y-1">
        <div className="text-xl font-bold text-center text-neutral-500">Hours</div>
        <div className="w-24 sm:w-32 h-[72px] sm:h-24 bg-dark-gray rounded-3xl flex items-center justify-center text-5xl sm:text-7xl font-bold">{ props.hours.toString().padStart(2, '0') }</div>
      </div>
      <div className="space-y-1">
        <div className="text-xl font-bold text-center text-neutral-500">Minutes</div>
        <div className="w-24 sm:w-32 h-[72px] sm:h-24 bg-dark-gray rounded-3xl flex items-center justify-center text-5xl sm:text-7xl font-bold">{ props.minutes.toString().padStart(2, '0') }</div>
      </div>
    </div>
  )
}

const Home = () => {
  const [date] = useState(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const [tokens, setTokens] = useState([]);
  useEffect(()=> {
    const fetchTokens = async ()=>{
      try {
      const apiURL = `${BACKEND_URI}/token/list`;
      const res = await axios.get(apiURL);
      setTokens(res.data);
      } catch (e){
        console.error(e);
      }
    }
    fetchTokens();
  }, [])

  return (
    <div className="container px-4 pb-24 mx-auto">
      <div className="flex flex-col items-center gap-10">
        <div className="mt-8 text-3xl font-bold text-center">Time until Clash</div>
        <Countdown date={date} renderer={Renderer} />
        <div className="text-2xl font-semibold text-center">$7,654,897 in loser pool</div>
      </div>
      <div className="flex justify-center">
        <Link to="/create" className="flex items-center justify-center mt-20 text-sm font-semibold text-black transition-all duration-300 rounded-full bg-primary h-7 hover:bg-secondary hover:text-white w-72">Create a new coin</Link>
      </div>
      <div className="mt-20">
        <div className="space-y-2">
          <div className="font-bold">Filter on:</div>
          <div className="flex flex-wrap gap-4">
            <button className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm border-primary hover:bg-secondary hover:border-secondary transition-all duration-200 ease-in-out`}>Top 10</button>
            <button className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm border-transparent hover:bg-secondary hover:border-secondary transition-all duration-200 ease-in-out`}>Creation Time</button>
            <button className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm border-transparent hover:bg-secondary hover:border-secondary transition-all duration-200 ease-in-out`}>Market Cap</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tokens.map((token, key) => <Link to={`/trade/${token.mint}`} key={key} className="p-3 pr-6 transition-all duration-200 cursor-pointer bg-dark-gray rounded-3xl hover:bg-slate-700">
            <div className="flex gap-4">
              <img src={token.uri} alt="" className="w-20 h-20 rounded-full" />
              <div className="">
                <div className="text-xl font-semibold">{token.name} <span className="text-primary">(#1)</span></div>
                <div className="font-semibold text-neutral-600">The best dog on CoinClash</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-primary">market cap: 2.15M</div>
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