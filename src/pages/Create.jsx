import { useState, useRef } from "react";
import { getAnchorProgram } from "../core/constants/anchor";
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { FEE_ACCOUNT, LIQUIDITY } from "../core/constants/address";
import { toast } from "react-toastify";
import { BACKEND_URI } from "../core/constants";

const Create = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDesc, setTokenDesc] = useState("");
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageDataUrl, setImageDataUrl] = useState("");

  const [isCreatingToken, setIsCreatingToken] = useState(false);
  // const { mutateAsync: uploadToPinataAsync, isPending: isUploading } =
  //   useUploadPinata()

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageDataUrl = reader.result
        setImageDataUrl(imageDataUrl);

      }
      reader.readAsDataURL(file)
    }
  }


  const createToken = async () => {
    if (!wallet || !connection || isCreatingToken) {
      toast.error("Please connect wallet first!")
      return
    }
    if (!tokenName || !tokenSymbol || !selectedFile) {
      toast.error("Please input the correct information!")
      return
    };
    setIsCreatingToken(true);
    let tokenUri = "";
    if (selectedFile) {
      try {
        // Upload image to IPFS using Pinata
        const data = new FormData()
        data.append('file', selectedFile)
        data.append('tokenName', tokenName)
        data.append('tokenSymbol', tokenSymbol)
        data.append('tokenDesc', tokenDesc)
        const res = await fetch(
          `${BACKEND_URI}/tokens/ipfs`,
          {
            method: 'POST',
            body: data,
          }
        );
        const resInfo = await res.json();
        if (!resInfo.ok) {
          toast.error('Failed to upload image to IPFS');
          setIsCreatingToken(false);
          return;
        }
        tokenUri = resInfo.uri;
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
        toast.error('Failed to upload image to IPFS');
        setIsCreatingToken(false);
        return;
      }
    }

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
    const associtedBondingCurve = getAssociatedTokenAddressSync(
      tokenMintKP.publicKey,
      bondingCurve,
      true,
    )
    const feeRecipient = new PublicKey(FEE_ACCOUNT);
    const associtedFeeTokenAccount = getAssociatedTokenAddressSync(tokenMintKP.publicKey, feeRecipient)
    const liquidity = new PublicKey(LIQUIDITY);
    const liquidityTokenAccount = getAssociatedTokenAddressSync(tokenMintKP.publicKey, liquidity)
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
    try {
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
        liquidity,
        liquidityTokenAccount,
        config,
        metadata,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: metaplexProgramId,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId
      }).signers([tokenMintKP]).rpc();
      toast.success(`Created ${tokenName} coin Successfully!`);
      setIsCreatingToken(false);
    } catch {
      toast.error(`Failed to create coin!`);
      setIsCreatingToken(false);
    }
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
          <textarea id="desc" rows="4" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            value={tokenDesc}
            onChange={(e) => setTokenDesc(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="thumbnail" className="font-bold">Image or Video</label>
            <div
              className="relative min-h-[200px] w-full cursor-pointer bg-cover bg-no-repeat md:w-1/2"
              onClick={() => fileInputRef.current?.click()}
            >
            {imageDataUrl ? (
              <img
                src={imageDataUrl}
                alt="Uploaded token image"
                className="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            ) : (
              <img
                src="/imgs/icon-file-upload.svg"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        <div className="p-4 pr-6 bg-dark-gray rounded-3xl">
          <div className="flex gap-4">
            <img src={imageDataUrl?imageDataUrl:"/imgs/logo.webp"} alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">{tokenName}</div>
              <div className="font-semibold text-neutral-500">{tokenDesc}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={isCreatingToken}
            className="flex items-center justify-center h-8 text-sm font-semibold text-black transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-80 disabled:opacity-30 disabled:cursor-normal"
            onClick={()=>createToken()}
          >
            {isCreatingToken?"Creating a new coin":"Create a new coin"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Create;