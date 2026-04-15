/** @type {import('next').NextConfig} */
import { webpackFallback } from '@txnlab/use-wallet-react'
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true
    },
    devIndicators: false
  }),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...webpackFallback
      }
    }
    // Prevent errors from React Native imports in MetaMask SDK
    config.resolve.fallback = {
      ...config.resolve.fallback,

      '@react-native-async-storage/async-storage': false,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
}

export default nextConfig