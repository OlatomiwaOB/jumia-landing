import { Wallet } from 'lucide-react'
import React from 'react'
import ConnectWallet from '../ui/connect-wallet'

const NotConnected = () => {
  return (
    <div className='flex absolute w-full gap-y-3 flex-col items-center h-[100%] justify-center'>
        <div className='h-[clamp(40px,5vw,60px)] w-[clamp(40px,5vw,60px)] rounded-full bg-accent text-white flex items-center justify-center'>
            <Wallet/>
        </div>

        <h2 className='text-[clamp(20px,3vw,30px)] font-bold'>Connect Your Wallet</h2>

        <p className='text-center text-black/80 text-sm md:text-[16px]'>
            Connect your wallet to view your pool position, deposit funds,
            <br/>
            or withdraw liquidity
        </p>

        <ConnectWallet/>
    </div>
  )
}

export default NotConnected