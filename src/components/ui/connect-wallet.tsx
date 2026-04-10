import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './dialog'
import ConnectPage from '@/app/connect_wallet/page'

const ConnectWallet = () => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <button className="rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent/90 transition-all">
            Connect wallet
            </button>
        </DialogTrigger>
        <DialogContent>
            <ConnectPage />
        </DialogContent>
    </Dialog>
  )
}

export default ConnectWallet