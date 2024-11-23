import { useEffect, useState } from "react";
import { io } from 'socket.io-client'
import { getAccount } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_COINKICK_PROGRAMID } from "./core/constants/address";
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { getGlobalConnection } from "./utils";
import { BACKEND_SOCKET } from "./core/constants";

export const socket = io(BACKEND_SOCKET, {
  autoConnect: true
})

export const useBondingCurveTokenAmount = (tokenMint) => {
  const tokenMintPulicKey = new PublicKey(tokenMint);
  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('pumpfun_bonding_curve'),
      tokenMintPulicKey.toBuffer(),
    ],
    new PublicKey(SOLANA_COINKICK_PROGRAMID)
  )
  const associtedBondingCurve = getAssociatedTokenAddressSync(
    tokenMintPulicKey,
    bondingCurve,
    true,
  );
  const [tokenAmount, setTokenAmount] = useState(0);
  useEffect(()=>{
    getAccount(getGlobalConnection(),associtedBondingCurve).then(tokenAccountInfo => {
      setTokenAmount(Number(tokenAccountInfo.amount.toString())/1000000000);
    })
  },[tokenMint])

  return tokenAmount;
}

// export const useQuoteSolanaTokenOut = (tokenMint, lamportsAmount) => {
//   if (!lamportsAmount) { //fee
//     return 0
//   }
//   const mint = new PublicKey(tokenMint)
//   const [bondingCurve] = PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("pumpfun_bonding_curve"),
//       mint.toBuffer()
//     ],
//     new PublicKey(SOLANA_COINKICK_PROGRAMID)
//   )
// }