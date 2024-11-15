import { useEffect, useState, useCallback } from "react";
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useParams } from "react-router-dom";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { FEE_ACCOUNT, LIQUIDITY } from "../core/constants/address";
import { getAnchorProgram } from "../core/constants/anchor";
import { BN } from '@coral-xyz/anchor';
import { numberWithCommas, calculateTokenAmount, MAX_SUPPLY } from '../utils/index';
import { useBondingCurveTokenAmount } from "../hooks";

import { BACKEND_URI } from "../core/constants";
import axios from "axios";
import { getMarketCap } from "../utils/index";
import { toast } from 'react-toastify';
import { TVChartContainer } from '../components/TVChartContainer/index';

const Trade = () => {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { tokenMint, rank } = useParams();
  const [inputSol, setInputSol] = useState('');
  const amountBondingCurve = useBondingCurveTokenAmount(tokenMint);
  const [outputToken, setOutputToken] = useState(0);

  const [tokenInfo, setTokenInfo] = useState();
  const [solPrice , setSolPrice] = useState(0);

  useEffect(() => {
    const currentSupply = MAX_SUPPLY - (amountBondingCurve*1000000000);
    const feeSol = ((inputSol??0) * 1000000000)/100;
    setOutputToken(calculateTokenAmount(currentSupply, (inputSol??0)*1000000000 - feeSol,9))
  }, [inputSol, amountBondingCurve])

  useEffect(() => {
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
    const fetchToken = async ()=>{
      try {
        if (!tokenMint) return;
        const apiURL = `${BACKEND_URI}/tokens/${tokenMint}`;
        const res = await axios.get(apiURL);
        if (res && res.data) {
          setTokenInfo(res.data);
        }
      } catch (e){
        console.error(e);
      }
    }
    fetchSolPrice();
    fetchToken();
  },[tokenMint])

  const handleAmountChange = useCallback(value => {
    const regex = /^\d*\.?\d{0,8}$/
    if (regex.test(value) || value === '') {
      setInputSol(value)
    }
  }, [setInputSol])

  const buyToken = async () => {
    const tokenMintPulicKey = new PublicKey(tokenMint);
    if (!wallet || !connection) {
      toast.error("Please connect wallet first!", {theme: "light"})
      return
    }
    if (!tokenMintPulicKey) {return};
    const payer = wallet.publicKey;
    const feeRecipient = new PublicKey(FEE_ACCOUNT);
    const liquidity = new PublicKey(LIQUIDITY);
    const program = getAnchorProgram(connection, wallet, {commitment: 'confirmed'});
    const [config] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pumpfun_config'),
      ],
      program.programId,
    );
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
    );

    const associtedUserTokenAccount = getAssociatedTokenAddressSync(
      tokenMintPulicKey,
      payer,
    );
    const inputSolAmount = isNaN(Number(inputSol))?0:Number(inputSol);
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
    }).signers([]).rpc();
    toast.success(`Buy ${tokenName} token Successfully!`)
  }
  return (
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
            <div className="">
              <div className="text-lg font-semibold">{tokenInfo?tokenInfo.name:''} {tokenInfo?`(${tokenInfo.symbol})`:''}</div>
              <div className="font-semibold text-neutral-500">{tokenInfo?tokenInfo.desc:''}</div>
            </div>
            <div className="ml-8 font-bold text-primary">#{rank}</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 mt-2 font-bold rounded-full bg-dark-gray">
          <div className="text-primary">market cap: {tokenInfo?getMarketCap(tokenInfo.solAmount, tokenInfo.soldTokenAmount, solPrice):0}</div>
          <div className="flex items-center gap-1">
            <img src="/imgs/user.svg" alt="" className="w-4 h-4" />
            <span>12.508</span>
          </div>
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
            className="flex items-center justify-center w-full h-8 mt-5 text-sm font-semibold text-black transition-all duration-300 rounded-lg bg-primary hover:bg-secondary hover:text-white"
            onClick={()=>buyToken()}
          >Buy</button>
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
