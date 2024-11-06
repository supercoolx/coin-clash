import { useState } from "react";
import { getAnchorProgram } from "../core/constants/anchor";
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { FEE_ACCOUNT } from "../core/constants/address";
import { toast } from "react-toastify";

const Create = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const createToken = async () => {
    if (!tokenName || !tokenSymbol || !tokenUri || !wallet || !connection) return;
    const payer = wallet.publicKey;
    const program = getAnchorProgram(connection, wallet, {commitment: 'confirmed'});
    const tokenMintKP = Keypair.generate()

    const [bondingCurve] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pumpfun_bonding_curve'),
        tokenMintKP.publicKey.toBuffer(),
      ],
      program.programId,
    )
    const feeRecipient = new PublicKey(FEE_ACCOUNT);
    const associtedBondingCurve = getAssociatedTokenAddressSync(
      tokenMintKP.publicKey,
      bondingCurve,
      true,
    )
    const associtedFeeTokenAccount = getAssociatedTokenAddressSync(tokenMintKP.publicKey, feeRecipient)
    const [config] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pumpfun_config'),
      ],
      program.programId,
    )

    const metaplexProgramId = new PublicKey(
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    )
    const [metadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        metaplexProgramId.toBuffer(), // mpl_token_metadata program id
        tokenMintKP.publicKey.toBuffer(),
      ],
      metaplexProgramId,
    )

    const hash = await program.methods.createToken({
      name: Buffer.from(tokenName),
      symbol: Buffer.from(tokenSymbol),
      uri: Buffer.from(tokenUri)
    }).accounts({
      payer,
      tokenMint: tokenMintKP.publicKey,
      bondingCurve,
      associtedBondingCurve,
      feeRecipient,
      associtedFeeTokenAccount,
      config,
      metadata,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: metaplexProgramId,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId
    }).signers([tokenMintKP]).rpc();
    toast.success(`Created ${tokenName} token Successfully!`)
  }
  return (
    <div className="container flex flex-col items-center px-4 pb-24 mx-auto">
      <form action="#" className="space-y-6 mt-10 w-full max-w-[400px]">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Token Name</label>
          <input
            type="text" name="name" id="name" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="ticker" className="font-bold">Ticker ($)</label>
          <input
            type="text" name="name" id="ticker" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="desc" className="font-bold">Description</label>
          <input type="text" name="name" id="desc" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="thumbnail" className="font-bold">Image or Video</label>
          <input
            type="text" name="name" id="thumbnail" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            value={tokenUri}
            onChange={(e) => setTokenUri(e.target.value)}
          />
        </div>
        <div className="p-4 pr-6 bg-dark-gray rounded-3xl">
          <div className="flex gap-4">
            <img src="/imgs/logo.webp" alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">SuperDawhg</div>
              <div className="font-semibold text-neutral-500">The best dog on CoinClash</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="flex items-center justify-center h-8 text-sm font-semibold text-black transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-80"
            onClick={()=>createToken()}
          >Create a new coin</button>
        </div>
      </form>
    </div>
  )
}

export default Create;