'use client'

import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import algosdk from 'algosdk'

const network = process.env.ALGOD_NETWORK || 'testnet'
// Create wallet manager instance
const walletManager = new WalletManager({
  wallets: [
    WalletId.DEFLY,
    WalletId.PERA,
    // WalletId.EXODUS,
  ],
  networks: {
    [network]: {
      algod:{
        baseServer: 'https://testnet-api.algonode.cloud',
        token: '',
        port: ''
      }
    }
  },
  defaultNetwork: NetworkId?.TESTNET,
})

export default function AlgorandWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider manager={walletManager}>
      {children}
    </WalletProvider>
  )
}