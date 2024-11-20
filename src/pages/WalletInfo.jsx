import { useState, useEffect } from 'react'
import { BACKEND_URI } from '../core/constants'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { getTokenPriceInSolPerOne, getTokenPriceInSol, getPercent } from '../utils/index'
const WalletInfo = () => {
  const [tokens, setTokens] = useState([])
  const wallet = useAnchorWallet()
  const [filter, setFilter] = useState(0)

  useEffect(()=>{
    const fetchTokens =  async () => {
      if (!wallet) {
        setTokens([])
        return
      }
      try {
        const apiURL = `${BACKEND_URI}/tokens/walletinfo/${wallet.publicKey.toBase58()}/${filter}`;
        const res = await axios.get(apiURL);
        setTokens(res.data);
      } catch (e) {
        console.error(e)
      }
    }
    fetchTokens()
  },[wallet, filter])

  return (
    <div className="container mx-auto flex flex-col gap-4 pb-[24px] px-4 max-w-[500px] mt-5">
      <input
        type="text"
        placeholder={"address or symbol"}
        className="w-full bg-transparent outline-none border border-white rounded-xl bg-slate-800 p-2"
        value={wallet?wallet.publicKey.toBase58():''}
      />
      <div className="flex justify-end">
        {wallet && <a href={`https://solscan.io/address/${wallet.publicKey.toBase58()}`} target="_blank" className="text-[#6E6E6E]">View on solscan</a>}
      </div>
      <div className="flex mt-2">
        <button
          className={`cursor-pointer text-lg font-medium ${filter == 0?'text-white':'text-[#999]'}`}
          onClick={()=>{setFilter(0)}}
        >
          Active tokens
        </button>
        <button
          className={`ml-4 cursor-pointer text-lg font-medium ${filter == 1?'text-white':'text-[#999]'}`}
          onClick={()=>{setFilter(1)}}
        >
          All tokens
        </button>
      </div>
      {
        tokens.map((token, index) => <Link to={`/trade/${token.tokenInfo.mint}/${index + 1}`} key={index} className="p-3 pr-6 transition-all duration-200 cursor-pointer bg-dark-gray rounded-3xl hover:bg-slate-700">
          <div className="flex gap-4">
            <img src={token.tokenInfo.imageUri} alt="" className="w-16 h-16 rounded-full" />
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <div className="text-lg font-semibold">{(BigInt(token.tokenAmount)/BigInt(1000000000)).toString()} {token.tokenInfo.symbol}</div>
                <div className="text-lg font-semibold">{Number(getTokenPriceInSol(token.tokenInfo.solAmount, token.tokenInfo.soldTokenAmount, token.tokenAmount))} SOL</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold text-neutral-500">{getTokenPriceInSolPerOne(token.tokenInfo.solAmount, token.tokenInfo.soldTokenAmount)} SOL</div>
                <div className="font-semibold"><span className="text-primary">+ {getPercent(token.tokenInfo.solAmount, token.tokenInfo.soldTokenAmount, token.tokenAmount)} %</span></div>
              </div>
            </div>
          </div>
        </Link>)
      }
    </div>
  )
}

export default WalletInfo