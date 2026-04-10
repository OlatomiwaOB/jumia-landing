'use client'
import { getConfig } from '@/wagmi.config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { useState } from 'react'
import { State, WagmiProvider } from 'wagmi'



type Props = {
  children: React.ReactNode;
  initialState: State | undefined;
};

export default function Providers({ children, initialState }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }))

  const [config] = useState(() => getConfig());

  return (
    <WagmiProvider config={config} initialState={initialState} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    </WagmiProvider> 
  )
}