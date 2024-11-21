import { clusterApiUrl, Connection } from "@solana/web3.js"

export const shortenAddress = (
  address,
  length = 6,
  rightLength = length,
) =>
  [
    address.slice(0, length),
    rightLength > 0 ? address.slice(rightLength * -1) : '',
  ].join('...')

export const numberWithCommas = (x) => {
  return x.toLocaleString('en-US')
}

export const getGlobalConnection = () => {
  return new Connection(clusterApiUrl("devnet"));
}

export const MAX_SUPPLY = 500_000_000_000_000_000;
const K = 0.000000024;
const INITIAL_PRICE = 25;
export const calculateTokenAmount = (currentSupply, lamportsAmount, decimals) => {
  const exponent = (K * currentSupply) / (10 ** decimals)
  const exp1 = Math.exp(exponent)
  const num = (lamportsAmount * K) / INITIAL_PRICE
  const ln = Math.log(num + exp1)
  const tokenAmount = (ln * 10**decimals) / K - currentSupply
  return tokenAmount < 0
          ? 0
          : Math.floor(tokenAmount) > (MAX_SUPPLY - 5_000_000_000_000_000)
            ? (MAX_SUPPLY - 5_000_000_000_000_000)
            : Math.floor(tokenAmount)
}

export const getMarketCap = (solAmount, soldTokenAmount, solPrice) => {
  if (Number(soldTokenAmount) == 0 ){
    return "0";
  }
  const marketCap = (Number(solAmount) * MAX_SUPPLY / Number(soldTokenAmount))/1000000000 * solPrice;
  if (marketCap >= 1000000) {
    return (marketCap / 1000000).toFixed(2) + "M";
  }else if ( marketCap >= 1000) {
    return (marketCap / 1000).toFixed(2) + "K";
  }else{
    return marketCap.toFixed(2);
  }
}

//current price token in sol
// solAmount: lamport
// soldTokenAmount: withDecimal (9)
export const getTokenPriceInSolPerOne = (solAmount, soldTokenAmount) => {
  return ((Number(solAmount)/ Number(soldTokenAmount)).toFixed(9)).replace(/\.?0+$/,'')
}

export const getTokenPriceInSol = (solAmount, soldTokenAmount, buyerAmount) => {
  return ((Number(solAmount) * Number(buyerAmount)/ (Number(soldTokenAmount) * 1000000000)).toFixed(9)).replace(/\.?0+$/,'')
}

export const getPercent = (solAmount, soldTokenAmount, buyerAmount) => {
  const a = getTokenPriceInSol(solAmount, soldTokenAmount, buyerAmount)
  return Number(a - solAmount/1000000000)*100/(Number(solAmount/1000000000))
}