import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { BACKEND_URI } from "../core/constants";
import axios from "axios";
import { getMarketCap, numberWithCommas } from "../utils";

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
  const [date] = useState(Date.now() + 3 * 24 * 60 * 60 * 1000)

  const [tokens, setTokens] = useState([])
  const [solPrice , setSolPrice] = useState(0)
  const [modalOpened, setModalOpened] = useState(false)
  const [filter, setFilter] = useState(0)
  const [pageSize, setPageSize] = useState(0)
  const [kickAmount, setKickAmount]= useState(0)

  useEffect(() => {
    document.title = 'CoinKick'
  }, [])

  useEffect(()=> {
    const fetchKickAmount = async () => {
      try {
        const apiURL = `${BACKEND_URI}/tokens/kick_amount`
        const res = await axios(apiURL)
        setKickAmount(Number(res.data)) // sol amount
      } catch(e) {
        setKickAmount(0)
      }
    }
    const interval = setInterval(()=>{
      fetchKickAmount()
    }, 8000) //every 8 seconds
    return () => clearInterval(interval)
  },[])

  useEffect(()=> {
    const fetchSolPrice = async () => {
      try {
        const apiURL = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        const res = await axios.get(apiURL);
        if (res && res.data) {
          const solPrice = res.data.solana.usd;
          setSolPrice(solPrice);
        }
      }catch (e) {
        console.error(e);
      }
    }
    const fetchTokens = async () => {
      try {
        const apiURL = `${BACKEND_URI}/tokens`;
        const res = await axios(apiURL);
        setTokens(res.data);

      }catch (e) {
        console.error(e);
      }
    }
    fetchSolPrice();
    fetchTokens();
  }, [])

  const showTokens = useMemo(() => {
    if (tokens.length < 1) return []
    if (filter === 0) { //leaderboard ( marketcap)
      return [...tokens].sort(
        (a,b)=> Number(b.solAmount) - Number(a.solAmount)
      )
    } else if (filter === 1) { // create-time
      return [...tokens].sort(
        (a,b)=> b.createdAt - a.createdAt
      )
    } else if (filter === 2) { // Top 10
      return [...tokens].sort(
        (a,b)=> Number(b.solAmount) - Number(a.solAmount)).slice(0, 10)
    } else {
      return []
    }
  },[JSON.stringify(tokens), filter])

  return (
    <div className="container px-4 pb-24 mx-auto">
      <div className="flex flex-col items-center gap-10">
        <div className="mt-8 text-3xl font-bold text-center">Time until Kick</div>
        <Countdown date={date} renderer={Renderer} />
        <div className="flex items-center justify-center border-y border-[#6e6e6e] w-full py-4">
          <div className="text-2xl font-semibold text-center">${numberWithCommas((Math.floor(kickAmount/1000000000) * solPrice))} in Kick pool</div>
          <img onClick={() => setModalOpened(true)} src="/imgs/info.svg" alt="info" className="ml-5 w-[30px] h-[27px] cursor-pointer"/>
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          to="/create"
          className="flex items-center justify-center mt-4 text-sm font-semibold text-black rounded-full bg-primary h-7 hover:opacity-80 w-72 h-[34px]"
        >
          Create a new coin
        </Link>
      </div>
      <div className="mt-10">
        <div className="space-y-2">
          <div className="font-bold">Filter on:</div>
          <div className="flex flex-wrap gap-4">
            <button
              className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm ${filter === 0 ?'border-primary':'border-transparent'} hover:bg-primary/30 transition-all duration-200 ease-in-out`}
              onClick={()=>setFilter(0)}
            >
              Leaderboard
            </button>
            <button
              className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm ${filter === 1 ?'border-primary':'border-transparent'} hover:bg-primary/30 transition-all duration-200 ease-in-out`}
              onClick={()=>setFilter(1)}
            >
              Creation Time
            </button>
            <button
              className={`rounded-full border-2 h-8 w-48 bg-dark-gray font-bold text-sm ${filter === 2 ?'border-primary':'border-transparent'} hover:bg-primary/30  transition-all duration-200 ease-in-out`}
              onClick={()=>setFilter(2)}
            >
              Top 10
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {showTokens.map((token, index) => <Link to={`/trade/${token.mint}`} key={index} className="p-3 pr-6 transition-all duration-200 cursor-pointer bg-dark-gray rounded-3xl hover:bg-slate-700">
            <div className="flex gap-4">
              <img src={token?.imageUri} alt="" className="w-20 h-20 rounded-full" />
              <div className="">
                <div className="text-xl font-semibold">{token.name} <span className="text-primary">(#{token.rank})</span></div>
                <div className="font-semibold text-neutral-600">{token.desc}</div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="font-semibold text-primary">market cap: {getMarketCap(token.solAmount, token.soldTokenAmount, solPrice)}</div>
            </div>
          </Link>)}
        </div>
        <div className="flex justify-center mt-5">
          <button
            className={`${pageSize>0?'cursor-pointer':'cursor-not-allowed text-[#aaa]'}`}
            onClick={()=>{pageSize > 0 ? setPageSize(pageSize - 1):''}}
          >
            [ &lt;&lt; ]
          </button>
          <span className="px-2">{pageSize + 1}</span>
          <button
            className={`${tokens.length > 40 * (pageSize+1) ?'cursor-pointer':'cursor-not-allowed text-[#aaa]'}`}
            onClick={()=>{tokens.length > 40 * (pageSize+1) ? setPageSize(pageSize + 1):''}}
          >
            [ &gt;&gt; ]
          </button>
        </div>
      </div>
      <div onClick={() => setModalOpened(prev => !prev)} className={`fixed inset-0 bg-black/50 flex items-center justify-center px-5 transition-all duration-500 ${modalOpened ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}>
        <div onClick={e => e.stopPropagation()} className={`border-2 border-white rounded-3xl w-[740px] h-[640px] font-semibold flex flex-col items-center justify-between bg-[#1b1d28] text-center py-5 px-5 text-xl transition-all duration-500`}>
          <div>
            <h1 className="text-3xl mt-5">Kick Rewards</h1>
            <p className="mt-5">Top 10 Tokens get a liquidity boost from the losing tokens.</p>
            <p className="">The amount of boost is based on the ending position of the token.</p>
            <p className="my-5">(All tokens in the top 10 are guaranteed to launch on Raydium)</p>
            <p className="mb-10">Liquidity at launch = Total liquidity in pool + (% of Kick Rewards)</p>
            <div className="flex justify-center gap-x-4">
              <div className="text-right">
                <p className="">60%</p>
                <p className="">20%</p>
                <p className="">10%</p>
                <p className="">4%</p>
                <p className="">3%</p>
                <p className="">2%</p>
                <p className="">1%</p>
              </div>
              <div className="text-left">
                <p className="">#1</p>
                <p className="">#2</p>
                <p className="">#3</p>
                <p className="">#4</p>
                <p className="">#5</p>
                <p className="">#6</p>
                <p className="">#7-10</p>
              </div>
            </div>
          </div>
          <div onClick={() => setModalOpened(false)} className="text-xl cursor-pointer">Got it</div>
        </div>
      </div>
    </div>
  )
}

export default Home;
