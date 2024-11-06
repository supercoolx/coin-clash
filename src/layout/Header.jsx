import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useWalletModal
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { shortenAddress } from "../utils";

const Header = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const { setVisible } = useWalletModal();
  const { connected, publicKey, disconnect } = useWallet();

  return (
    <header className="overflow-hidden">
      <div className="flex items-center w-full h-10 bg-black">
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
      <div className="container flex justify-between gap-10 px-4 py-4 mx-auto sm:flex-row">
        <Link to="/" className="text-3xl font-bold">CoinClash<span className="text-primary">.fun</span></Link>
        <div className="items-center justify-between flex-1 hidden lg:flex">
          <div className="flex items-center flex-1 gap-10">
            <div className="flex items-center gap-2">
              <img src="/imgs/x.webp" alt="" className="rounded-full" />
              <img src="/imgs/telegram.webp" alt="" className="rounded-full" />
            </div>
            <div className="flex items-center gap-16 text-lg font-bold">
              <button onClick={() => setModalOpened(true)} className="">How it works</button>
              <button className="">Support</button>
            </div>
          </div>
          <button
            className="h-8 text-sm font-bold text-black transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-60"
            onClick={()=>{connected?disconnect():setVisible(true)}}
          >{
            connected?shortenAddress(publicKey.toBase58()):"Connect wallet"
          }</button>
        </div>
        <img onClick={() => setMenuOpened(prev => !prev)} src="/imgs/menu.svg" alt="" className="relative z-20 block w-8 h-8 cursor-pointer lg:hidden" />
      </div>

      <div className={`fixed top-0 left-0 flex lg:hidden flex-col items-center justify-center w-screen h-screen gap-20 bg-black/90 transition-all duration-300 ${ menuOpened ? 'translate-x-0' : '-translate-x-full' }`}>
        <div className="flex flex-col gap-5 text-2xl font-bold">
          <button onClick={() => setModalOpened(true)} className="">How it works</button>
          <button className="">Support</button>
        </div>
        <div className="flex items-center gap-5">
          <img src="/imgs/x.webp" alt="" className="w-10 h-10 rounded-full" />
          <img src="/imgs/telegram.webp" alt="" className="w-10 h-10 rounded-full" />
        </div>
        <button className="h-8 text-sm font-bold text-black transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-60">Connect wallet</button>
      </div>

      <div onClick={() => setModalOpened(false)} className={`fixed z-10 inset-0 bg-black/50 items-center justify-center px-5 ${modalOpened ? 'flex' : 'hidden'}`}>
        <div onClick={e => e.stopPropagation()} className="border-2 border-white rounded-2xl w-[480px] h-[560px] font-bold flex flex-col items-center justify-between bg-slate-700 text-center py-5 px-5">
          <div className="">
            <h1 className="text-3xl">How it works</h1>
            <p className="mt-5">All token created on CoinClash are safe from rugpulls.</p>
            <p className="">Each token is a faire launch with no presale and no team allocation.</p>
            <p className="">Only the top 10 tokens will be launched. All liquidity from all other tokens will be added to the top 10 to give them a kickstart at launch.</p>
          </div>
          <div onClick={() => setModalOpened(false)} className="text-xl cursor-pointer">Got it</div>
        </div>
      </div>
    </header>
  )
}

export default Header;