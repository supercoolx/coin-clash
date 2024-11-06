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
const K = 0.00000001;
const INITIAL_PRICE = 5000;
export const calculateTokenAmount = (currentSupply, lamportsAmount, decimals) => {
  const exponent = (K * currentSupply) / (10 ** decimals)
  const exp1 = Math.exp(exponent)
  const num = (lamportsAmount * K) / INITIAL_PRICE
  const ln = Math.log(num + exp1)
  const tokenAmount = (ln * 10**decimals) / K - currentSupply
  return tokenAmount < 0 ? 0 : Math.floor(tokenAmount)
}