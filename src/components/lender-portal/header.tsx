'use client'
import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from 'lucide-react'
import ConnectWallet from '../ui/connect-wallet'
import Image from 'next/image'

const logo = process?.env?.NEXT_PUBLIC_LOGO_URL || '/placeholder.svg'
const LenderPortalHeader = () => {
    const {isConnected,address} = useAccount()
    const {disconnect} = useDisconnect()
  return (
    <header className='p-4 w-full shadow-2xs flex items-center justify-between'>
        <Image
            src={logo}
            alt="BFPAY Logo"
            width={80}
            height={80}
            className="object-contain"
            />

        {
            !isConnected 
            ?
            <ConnectWallet/>
            : 

            <DropdownMenu>
                <DropdownMenuTrigger className='rounded-full flex items-center justify-center gap-x-2'>
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                          <AvatarFallback className="bg-accent text-primary-foreground">
                          <User className="w-4 h-4 lg:w-5 lg:h-5" />
                          </AvatarFallback>
                      </Avatar>
                      <span className='hidden md:block'>{address?.slice(0,4)}...{address?.slice(-4)}</span>
                  </DropdownMenuTrigger>
                <DropdownMenuContent>
                      <DropdownMenuItem onClick={()=>disconnect()}>Disconnect wallet</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        }

    </header>
  )
}

export default LenderPortalHeader