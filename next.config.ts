import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains: [
      'mmcpdocs.s3.eu-west-2.amazonaws.com'
    ]
  },
   webpack: (config, { isServer }) => {
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
  ...(process.env.NODE_ENV==='production' && {
    devIndicators: false,
   typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },

    compiler:{
      removeConsole:true
    }
  }),
   typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },

    devIndicators: false
};

export default nextConfig;
