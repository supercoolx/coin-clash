import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useWalletModal
} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

const Header = () => {
  const [modalOpened, setModalOpened] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)
  const { setVisible } = useWalletModal()
  const { connected, disconnect } = useWallet()
  const [tokens, setTokens] = useState([])
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const apiURL = `${BACKEND_URI}/tokens/top2`
        const res = await axios(apiURL)
        setTokens(res.data)
      }catch (e) {
        console.error(e)
      }
    }
    fetchTokens
  })


  return (
    <header className="overflow-hidden">
      <div className="flex items-center w-full h-10 bg-black">
        <marquee behavior="" direction="">
          <div className="flex items-center gap-5">
            {tokens.map((token, index) => (
              <div className="flex items-center gap-2">
              <img src={token.imageUri} alt="" className="rounded-full w-7 h-7" />
              <div className="text-xl font-semibold">#{index+1} Previous Winner</div>
            </div>
            ))}
          </div>
        </marquee>
      </div>
      <div className="container flex justify-between gap-10 px-4 py-4 mx-auto sm:flex-row">
        <Link to="/" className="flex items-center gap-2">
        <img src="/imgs/lightning.webp" alt="" className="transition-all duration-300 rotate-180 hover:rotate-0" />
        <div className="text-3xl font-bold">CoinClash<span className="text-primary">.fun</span></div>
        </Link>
        <div className="items-center justify-between flex-1 hidden lg:flex">
          <div className="flex items-center flex-1 gap-10">
            <div className="flex items-center gap-2">
              <a href="https://x.com/Coinkickfun"><img src="/imgs/x.webp" alt="" className="rounded-full" /></a>
              <img src="/imgs/telegram.webp" alt="" className="rounded-full" />
            </div>
            <div className="flex items-center gap-16 text-lg font-bold">
              <button onClick={() => setModalOpened(true)} className="">How it works</button>
              <button className="">Support</button>
            </div>
          </div>
          {!connected && <button
            className="h-8 text-sm font-bold text-[#131722] transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-[200px] "
            onClick={()=>{setVisible(true)}}
          >Connect wallet</button>}
          {connected && (
            <Link to="/walletinfo">
              <button className="h-8 text-sm font-bold text-[#131722] transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-[200px]">
                My Wallet
              </button>
            </Link>
          )}
          {connected && <button onClick={disconnect} className="cursor-pointer"><img src="/imgs/disconnect.svg" alt="disconnect" className="ml-2 w-7 h-7" /></button>}
        </div>
        <img onClick={() => setMenuOpened(prev => !prev)} src="/imgs/menu.svg" alt="" className="relative block w-8 h-8 cursor-pointer lg:hidden z-[100]" />
      </div>

      <div className={`fixed top-0 left-0 flex lg:hidden flex-col items-center justify-center w-screen h-screen gap-20 bg-black/90 z-[99] transition-all duration-300 ${ menuOpened ? 'translate-x-0' : '-translate-x-full' }`}>
        <div className="flex flex-col gap-5 text-2xl font-bold">
          <button onClick={() => setModalOpened(true)} className="">How it works</button>
          <button className="">Support</button>
        </div>
        <div className="flex items-center gap-5">
          <img src="/imgs/x.webp" alt="" className="w-10 h-10 rounded-full" />
          <img src="/imgs/telegram.webp" alt="" className="w-10 h-10 rounded-full" />
        </div>
        <button
          className="h-8 text-sm font-bold text-[#131722] transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-60"
          onClick={()=>{connected?disconnect():setVisible(true)}}
        >{connected?"My Wallet":"Connect wallet"}</button>
      </div>

      <div onClick={() => setModalOpened(prev => !prev)} className={`fixed inset-0 bg-black/50 flex items-center justify-center px-5 transition-all duration-500 ${modalOpened ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}>
        <div onClick={e => e.stopPropagation()} className={`border-2 border-white rounded-3xl w-[740px] h-[640px] font-semibold flex flex-col items-center justify-between bg-[#1b1d28] text-center py-5 px-5 text-xl transition-all duration-500`}>
          <div className="space-y-5">
            <h1 className="text-3xl">How it works</h1>
            <p className="">All token created on CoinKick are a <span className="text-primary">fair launch</span>, making all tokens created <span className="text-primary">safe from rugpulls.</span></p>
            <p className="">When the Kick timer ends, <span className="text-primary">only the top 10 tokens</span> will be launched. All liquidity from all other tokens will be added to the top 10 to give them a kickstart at launch.</p>
            <p className="">100% of the SOL raised + the SOL raised of the losing tokens will be added as liquidity. Therefore the launch price is always higher than the last price before the Kick timer.</p>
            <p className="">The prices of the tokens will increase exponentially during the sale giving the early investors a huge return at launch.</p>
            <p className="">You can sell your tokens with Raydium after launch.</p>
          </div>
          <div onClick={() => setModalOpened(false)} className="text-xl cursor-pointer">Got it</div>
        </div>
      </div>
    </header>
  )
}

export default Header