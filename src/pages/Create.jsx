import { useEffect, useState, useRef, useCallback } from "react";
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
import { Modal } from "../components/Modal";
import { numberWithCommas, calculateTokenAmount, MAX_SUPPLY } from '../utils/index';
import { Transaction } from "@solana/web3.js";
import { BN } from '@coral-xyz/anchor';

const Create = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDesc, setTokenDesc] = useState("");
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageDataUrl, setImageDataUrl] = useState("");

  const [telegram, setTelegram] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");

  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [firstBuyAmount, setFirstBuyAmount] = useState(0.05);
  const [calculatedOutputToken, setCalculatedOutputToken] = useState(0);
  // const { mutateAsync: uploadToPinataAsync, isPending: isUploading } =
  //   useUploadPinata()
  useEffect(() => {
    document.title = 'Create a coin | CoinKick'
  }, [])
  useEffect(() => {
    const currentSupply = MAX_SUPPLY * 1/100;
    const feeSol = ((firstBuyAmount??0) * 1000000000)/100;
    setCalculatedOutputToken(calculateTokenAmount(currentSupply, (firstBuyAmount??0)*1000000000 - feeSol, 9))
  }, [firstBuyAmount])


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

  const showTokenModal = () => {
    if (!tokenName || !tokenSymbol || !selectedFile || !tokenDesc) {
      toast.error("Please input the correct information!")
      return
    };
    setShowModal(true);
  }

  const createToken = async () => {
    if (!wallet || !connection || isCreatingToken) {
      toast.error("Please connect wallet first!")
      return
    }
    if (Number(firstBuyAmount) < 0.05) {
      toast.error("Must input minium 0.05 SOL")
      return;
    }
    if (!tokenName || !tokenSymbol || !selectedFile) {
      toast.error("Please input the correct information!")
      return
    };
    setShowModal(false);
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
        data.append('tokenTelegram', telegram)
        data.append('tokenTwitter', twitter)
        data.append('tokenWebsite', website)
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
      const transaction = new Transaction()
      const createTokenIns = await program.methods.createToken({
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
      }).instruction();//.signers([tokenMintKP]).rpc();
      //buy tx
      const associtedUserTokenAccount = getAssociatedTokenAddressSync(
        tokenMintKP.publicKey,
        payer,
      );

      const buyIns = await program.methods.buyInSol(
        new BN(0),
        new BN(Number((firstBuyAmount * 1000000000).toFixed(0)))
      ).accounts({
        tokenMint: tokenMintKP.publicKey,
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
      }).instruction();
      transaction.add(createTokenIns);
      transaction.add(buyIns);
      const hash = await program.provider.sendAndConfirm(transaction, [tokenMintKP]);
      toast.success(`Created ${tokenName} coin Successfully!`);
      setIsCreatingToken(false);
    } catch (e) {
      toast.error(`Failed to create coin!`);
      setIsCreatingToken(false);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const handleAmountChange = useCallback(value => {
    const regex = /^\d*\.?\d{0,8}$/
    if (regex.test(value) || value === '') {
      setFirstBuyAmount(value)
    }
  }, [setFirstBuyAmount])

  return (
    <>
    {
      showModal && (
        <Modal
          open={showModal}
          onOpenChange={(open) => !open && closeModal()}
          title="Deposit"
        >
          <div className="flex-col justify-center items-center z-10 relative px-4">
            <p className="font-medium text-sm text-white">Choose how many [{tokenSymbol}] you want to buy</p>
            <div className="flex gap-2 p-1 mt-2 border border-white rounded-xl bg-slate-800">
              <div className="flex items-center flex-1 px-2">
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full bg-transparent outline-none"
                  value={firstBuyAmount}
                  onChange={(e)=>handleAmountChange(e.target.value)}
                />
              </div>
              <div className="w-12 rounded-full">
                <img src="/imgs/solana.webp" alt="" className="w-12 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-end mt-1">
            <div className="flex-1">
            {numberWithCommas(calculatedOutputToken/1000000000)} <span className="text-neutral-500">{tokenSymbol}</span>
            </div>
              <p className="text-neutral-400 text-xs">minium 0.05 SOL</p>
            </div>
            <button
              disabled={firstBuyAmount < 0.05}
              className="mt-4 w-full p-2 flex rounded-[6px] items-center justify-center text-sm font-medium bg-blue-800 text-white cursor-pointer disabled:opacity-50 disabled:cursor-normal"
              onClick={()=>createToken()}
            >
              Create coin
            </button>
          </div>
        </Modal>
      )
    }
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
              className="relative min-h-[200px] w-full cursor-pointer bg-cover bg-no-repeat md:w-1/2 border border-white rounded-lg"
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
        <div className="flex flex-col gap-2">
          <label htmlFor="telegram" className="font-bold">Telegram</label>
          <input
            type="text" name="name" id="telegram" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            placeholder="(optional)"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="twitter" className="font-bold">Twitter</label>
          <input
            type="text" name="name" id="twitter" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            placeholder="(optional)"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="website" className="font-bold">Website</label>
          <input
            type="text" name="name" id="website" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800"
            placeholder="(optional)"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
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
            onClick={()=>showTokenModal()}
          >
            {isCreatingToken?"Creating a new coin":"Create a new coin"}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Create;