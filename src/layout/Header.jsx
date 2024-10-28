import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="">
      <div className="w-full bg-black h-10 flex items-center">
        <marquee behavior="" direction="">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <img src="/imgs/logo.webp" alt="" className="rounded-full w-7 h-7" />
              <div className="text-xl font-semibold">#1 Previous Winner</div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/imgs/logo.webp" alt="" className="rounded-full w-7 h-7" />
              <div className="text-xl font-semibold">#1 Previous Winner</div>
            </div>
          </div>
        </marquee>
      </div>
      <div className="container px-4 mx-auto flex flex-col-reverse sm:flex-row gap-2 justify-between py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-12">
          <div className="flex items-center gap-7">
            <Link to="/" className="text-3xl font-bold">CoinClash<span className="text-primary">.fun</span></Link>
            <div className="flex items-center gap-2">
              <img src="/imgs/x.webp" alt="" className="rounded-full" />
              <img src="/imgs/telegram.webp" alt="" className="rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-16 text-lg font-bold">
            <button onClick={() => setOpened(true)} className="">How it works</button>
            <button className="">Support</button>
          </div>
        </div>
        <button className="rounded-full bg-primary text-black text-sm h-8 transition-all duration-300 font-bold hover:bg-secondary hover:text-white w-60">Connect wallet</button>
      </div>
      <div onClick={() => setOpened(false)} className={`fixed z-10 inset-0 bg-black/50 items-center justify-center px-5 ${ opened ? 'flex' : 'hidden'}`}>
        <div onClick={e => e.stopPropagation()} className="border-2 border-white rounded-2xl w-[480px] h-[560px] font-bold flex flex-col items-center justify-between bg-slate-700 text-center py-5 px-5">
          <div className="">
            <h1 className="text-3xl">How it works</h1>
            <p className="mt-5">All token created on CoinClash are safe from rugpulls.</p>
            <p className="">Each token is a faire launch with no presale and no team allocation.</p>
            <p className="">Only the top 10 tokens will be launched. All liquidity from all other tokens will be added to the top 10 to give them a kickstart at launch.</p>
          </div>
          <div onClick={() => setOpened(false)} className="text-xl cursor-pointer">Got it</div>
        </div>
      </div>
    </div>
  )
}

export default Header;