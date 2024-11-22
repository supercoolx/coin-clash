import { useEffect, useState, useCallback, useMemo } from "react"
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useParams } from "react-router-dom"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,

} from '@solana/spl-token'

import { FEE_ACCOUNT, LIQUIDITY, SOLANA_COINKICK_PROGRAMID } from "../core/constants/address"
import { getAnchorProgram } from "../core/constants/anchor"
import { BN } from '@coral-xyz/anchor'
import { numberWithCommas, calculateTokenAmount, MAX_SUPPLY } from '../utils/index'
import { useBondingCurveTokenAmount } from "../hooks"

import { BACKEND_URI } from "../core/constants"
import axios from "axios"
import { getMarketCap } from "../utils/index"
import { toast } from 'react-toastify'
import { TVChartContainer } from '../components/TVChartContainer/index'
import { SOLANA_API_URL } from "../core/constants"

const Trade = () => {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { tokenMint } = useParams()
  const [inputSol, setInputSol] = useState('')
  const amountBondingCurve = useBondingCurveTokenAmount(tokenMint)
  const [outputToken, setOutputToken] = useState(0)

  const [tokenInfo, setTokenInfo] = useState()
  const [solPrice , setSolPrice] = useState(0)
  const [holders, setHolders] = useState([])
  const [modalOpened, setModalOpened] = useState(false)
  const [hash, setHash] = useState()
  useEffect(() => {
    document.title = `${tokenInfo?.symbol} | CoinKick`
  }, [tokenInfo])

  useEffect(() => {
    const currentSupply = MAX_SUPPLY - (amountBondingCurve*1000000000)
    const feeSol = ((inputSol??0) * 1000000000)/100
    setOutputToken(calculateTokenAmount(currentSupply, (inputSol??0)*1000000000 - feeSol,9))
  }, [inputSol, amountBondingCurve])

  const liquidityAddr = useMemo(() => {
    try{
      const liquidity = new PublicKey(LIQUIDITY)
      const tokenMintPublicKey = new PublicKey(tokenMint)
      return getAssociatedTokenAddressSync(tokenMintPublicKey, liquidity, true).toBase58()
    }catch {
      return ""
    }
  },[tokenMint])
  const priceCurveAddr = useMemo(() => {
    try {
      const tokenMintPublicKey = new PublicKey(tokenMint)
      const [bondingCurve] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('pumpfun_bonding_curve'),
          tokenMintPublicKey.toBuffer(),
        ],
        new PublicKey(SOLANA_COINKICK_PROGRAMID),
      )
      return getAssociatedTokenAddressSync(tokenMintPublicKey, bondingCurve, true).toBase58()
    } catch {
      return ""
    }
  }, [tokenMint])
  useEffect(()=>{
    if (!tokenMint) return;
    const fetchTokenLargestAccounts = async () => {
      try {
        const res = await axios.post(SOLANA_API_URL, {
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenLargestAccounts",
          params: [
            tokenMint
          ]
        })

        if(res && res.data && res.data.result){
          setHolders(res.data.result.value.map(value => {
            return {
              address: value.address,
              amount: value.amount
            }
          }))
        }
      }catch(e) {
        console.error(e)
      }
    }
    fetchTokenLargestAccounts()
  },[tokenMint])

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const apiURL = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        const res = await axios.get(apiURL)
        if (res && res.data) {
          const solPrice = res.data.solana.usd
          setSolPrice(solPrice)
        }
      }catch (e) {
        console.error(e)
      }
    }
    const fetchToken = async ()=>{
      try {
        if (!tokenMint) return
        const apiURL = `${BACKEND_URI}/tokens/${tokenMint}`
        const res = await axios.get(apiURL)
        if (res && res.data) {
          setTokenInfo(res.data)
        }
      } catch (e){
        console.error(e)
      }
    }
    fetchSolPrice()
    fetchToken()
  },[tokenMint])

  const handleAmountChange = useCallback(value => {
    const regex = /^\d*\.?\d{0,8}$/
    if (regex.test(value) || value === '') {
      setInputSol(value)
    }
  }, [setInputSol])

  const buyToken = async () => {
    const tokenMintPulicKey = new PublicKey(tokenMint)
    if (!wallet || !connection) {
      toast.error("Please connect wallet first!", {theme: "light"})
      return
    }
    if (!tokenMintPulicKey) {return}
    const payer = wallet.publicKey
    const feeRecipient = new PublicKey(FEE_ACCOUNT)
    const liquidity = new PublicKey(LIQUIDITY)
    const program = getAnchorProgram(connection, wallet, {commitment: 'confirmed'})
    const [config] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pumpfun_config'),
      ],
      program.programId,
    )
    const [bondingCurve] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pumpfun_bonding_curve'),
        tokenMintPulicKey.toBuffer(),
      ],
      program.programId,
    )
    const associtedBondingCurve = getAssociatedTokenAddressSync(
      tokenMintPulicKey,
      bondingCurve,
      true,
    )

    const associtedUserTokenAccount = getAssociatedTokenAddressSync(
      tokenMintPulicKey,
      payer,
    )
    const inputSolAmount = isNaN(Number(inputSol))?0:Number(inputSol)
    const hash = await program.methods.buyInSol(
      new BN(0),
      new BN(Number((inputSolAmount * 1000000000).toFixed(0)))
    ).accounts({
      tokenMint: new PublicKey(tokenMint),
      config,
      bondingCurve,
      associtedBondingCurve,
      associtedUserTokenAccount,
      feeAccount: feeRecipient,
      liquidity: liquidity,
      user: payer,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }).signers([]).rpc()
    setHash(hash)
    setModalOpened(true)

    // toast.success(`Buy ${tokenName} token Successfully!`)
  }
  return (
    <>
      <div onClick={() => setModalOpened(prev => !prev)} className={`fixed inset-0 bg-black/50 flex items-center justify-center px-5 transition-all duration-500 ${modalOpened ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}>
        <div onClick={e => e.stopPropagation()} className={`border border-primary rounded-xl w-[350px] font-semibold flex flex-col items-center justify-between bg-[#1b1d28] text-center py-5 px-5 text-xl transition-all duration-500`}>
          <div className="flex justify-between w-full">
            <div className="w-1/2 flex flex-col">
              <div className="text-sm flex font-bold text-wrap">buy {numberWithCommas(outputToken/1000000000)} {tokenInfo?tokenInfo.symbol:''} for {inputSol} SOL</div>
              <div className="text-sm flex font-normal">Transaction confirmed</div>
            </div>
            <div className="w-1/2 flex justify-end items-center">
              <a href={`https://solscan.io/tx/${hash}`} className="rounded-[6px] bg-transparent cursor-pointer border border-white text-sm font-normal p-2">View tx</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row gap-4 pb-[24px] mt-20 px-4">
        <div className="flex-1">
          <div style={{ height: "600px", width: "100%" }}>
            {tokenInfo && <TVChartContainer tokenInfo={tokenInfo}/>}
          </div>
        </div>
        <div className="">
          <div className="p-4 pr-6 bg-dark-gray rounded-3xl">
            <div className="flex gap-4">
              <img src={tokenInfo?.imageUri} alt="" className="w-16 h-16 rounded-full" />
              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <div className="text-lg font-semibold">{tokenInfo?tokenInfo.name:''} {tokenInfo?`(${tokenInfo.symbol})`:''}</div>
                  <div className="font-bold text-primary">#{tokenInfo?.rank}</div>
                </div>
                <div className="font-semibold text-neutral-500">{tokenInfo?tokenInfo.desc:''}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end px-4 py-2 mt-2 font-bold rounded-full bg-dark-gray">
            <div className="text-primary">market cap: {tokenInfo?getMarketCap(tokenInfo.solAmount, tokenInfo.soldTokenAmount, solPrice):0}</div>
          </div>
          <div className="p-5 mt-2 font-bold bg-dark-gray rounded-3xl">
            <div className="text-neutral-500">{numberWithCommas(amountBondingCurve)} {tokenInfo?tokenInfo.symbol:''} Remaining</div>
            <div className="flex gap-2 p-1 mt-2 border border-white rounded-xl">
              <div className="flex items-center flex-1 px-2">
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full bg-transparent outline-none"
                  value={inputSol}
                  onChange={(e)=>handleAmountChange(e.target.value)}
                />
              </div>
              <div className="w-12 rounded-full">
                <img src="/imgs/solana.webp" alt="" className="w-12 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500"
                onClick={()=>setInputSol("0.1")}
              >0.1SOL</button>
              <button
                className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500"
                onClick={()=>setInputSol("0.5")}
              >0.5SOL</button>
              <button
                className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500"
                onClick={()=>setInputSol("1")}
              >1SOL</button>
              <button
                className="w-16 h-6 rounded-lg bg-neutral-800 text-neutral-500"
                onClick={()=>setInputSol("5")}
              >5SOL</button>
            </div>
            <div className="mt-5">
              {numberWithCommas(outputToken/1000000000)} <span className="text-neutral-500">{tokenInfo?.symbol}</span>
            </div>
            <button
              className="flex items-center justify-center w-full h-8 mt-5 text-sm font-semibold text-black transition-all duration-300 rounded-lg bg-primary hover:opacity-80"
              onClick={()=>buyToken()}
            >Buy</button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-5">
            {tokenInfo && tokenInfo.twitter && <a href={tokenInfo.twitter.substring(0,8) !=='https://'?`https://${tokenInfo.twitter}`:tokenInfo.twitter}><img src="/imgs/x.webp" alt="" className="" /></a>}
            {tokenInfo && tokenInfo.telegram && <a href={tokenInfo.telegram.substring(0,8)!=='https://'?`https://${tokenInfo.telegram}`:tokenInfo.telegram}><img src="/imgs/telegram.webp" alt="" className="" /></a>}
            {tokenInfo && tokenInfo.website && <a href={tokenInfo.website.substring(0,8)!=='https://'?`https://${tokenInfo.website}`:tokenInfo.website}><img src="/imgs/website.svg" alt="" className="w-[26px] h-[26px]" /></a>}
          </div>
          <div className="mt-5 font-bold">
            <div className="text-lg text-neutral-500">Token Distribution</div>
            <div className="mt-2">
              {holders.map((holder, index) => (
              <div key={`holder-${index}`} className="flex justify-between">
                <div className="text-neutral-500">{index+1}. {holder.address === liquidityAddr ?'Liquidity':holder.address === priceCurveAddr ? 'Price Curve':holder.address.substring(0,6)}</div>
                <div className="text-neutral-500">{Number((Number(holder.amount)/10000000000000000).toFixed(2))}%</div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Trade
