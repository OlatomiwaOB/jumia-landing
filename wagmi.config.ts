// wagmi.config.ts
import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { defineChain } from "viem";

// Define Arc testnet
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Arc Explorer', 
      url: 'https://testnet.arcscan.app'
    },
  },
  testnet: true,
});

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, arcTestnet], // Added Arc testnet here
    connectors:[
      metaMask()
    ],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [baseSepolia.id]: http(),
      [arcTestnet.id]: http(), // Added Arc testnet transport
    },
  });
}