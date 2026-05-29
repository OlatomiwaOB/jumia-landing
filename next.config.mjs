/** @type {import('next').NextConfig} */
import { webpackFallback } from '@txnlab/use-wallet-react'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  /**
  * 🔥 DEV PERFORMANCE (Huge win)
  * Disable StrictMode in dev to avoid double renders
  */
  reactStrictMode: isProd,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
    devIndicators: false,
    productionBrowserSourceMaps: false,
  }),

  // Optimize package imports - CRITICAL for reducing bundle size
  experimental: {
    optimizePackageImports: [
      'wagmi',
      'viem',
      '@tanstack/react-query',
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@headlessui/react',
      '@aws-amplify/ui-react',
      'react-hook-form',
      'date-fns',
      'zustand',
      'react-day-picker',
      'sonner',
      'rc-table',
    ],
  },

  webpack: (config, { isServer, dev }) => {
    /**
     * 🔥 DEV PERFORMANCE OPTIMIZATIONS
     */
    if (dev) {
      // Kill source maps - massive speedup for large deps
      config.devtool = false

      // Filesystem cache for faster rebuilds
      config.cache = { type: 'filesystem' }

      // Reduce file watching overhead
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }

      // Skip watching most node_modules (except actively used packages)
      config.snapshot = {
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!wagmi|viem|@walletconnect)/],
      }
    }

    // React Native modules that need to be stubbed for web
    const reactNativeModules = [
      '@react-native-async-storage/async-storage',
      '@react-native-community/netinfo',
      'react-native',
    ]



    // Client-side fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...webpackFallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        http: false,
        https: false,
        zlib: false,
      }

      // Add React Native modules to fallback
      reactNativeModules.forEach((mod) => {
        config.resolve.fallback[mod] = false
      })
    }

    // Add aliases to resolve React Native modules to empty modules
    config.resolve.alias = {
      ...config.resolve.alias,
      ...reactNativeModules.reduce((acc, mod) => {
        acc[mod] = false
        return acc
      }, {}),
    }

    // Server-side externals for heavy packages
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'algosdk': 'commonjs algosdk',
        'tronweb': 'commonjs tronweb',
        'aws-amplify': 'commonjs aws-amplify',
        'pino-pretty': 'commonjs pino-pretty',
      })
    }

    // Only split chunks in production (adds overhead in dev)
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
      }
    }

    return config
  },

}

export default nextConfig
