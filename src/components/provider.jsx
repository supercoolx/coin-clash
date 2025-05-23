import { useMemo, useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ToastContainer } from "react-toastify";
import "@solana/wallet-adapter-react-ui/styles.css";
import 'react-toastify/dist/ReactToastify.css'

export const Provider = ({
  children,
}) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new TrustWalletAdapter(),
          new SolflareWalletAdapter({ network }),
      ],
      [network],
  )
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick={true}
        pauseOnHover={true}
      />
    </ConnectionProvider>
  )
}