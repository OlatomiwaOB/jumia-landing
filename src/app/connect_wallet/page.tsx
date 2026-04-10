'use client';

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConnectPage() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

//   // Redirect if already connected
//   useEffect(() => {
//     if (isConnected && address) {
//       setIsRedirecting(true);
//       const timer = setTimeout(() => {
//         router.push('/');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [isConnected, address, router]);

  console.log(chain);
  console.log(connectors.map(connector=>connector));
  
  
  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getConnectorIcon = (connectorName: string) => {
    switch (connectorName.toLowerCase()) {
      case 'metamask':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#E2761B" stroke="#E2761B"/>
            <path d="M15.5 8.5L14 7L12.5 8.5L11 7L9.5 8.5L8 7V11.5L9.5 13L11 14.5V17L12.5 18.5L14 17V14.5L15.5 13L17 11.5V7L15.5 8.5Z" fill="white"/>
            <path d="M14 11.5H17M11 11.5H8" stroke="white" strokeWidth="2"/>
          </svg>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">?</span>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-inherit flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-indigo-600">
              {process.env.NEXT_PUBLIC_STORE_FRONT === 'h2p' ? "Help2Pay" : 'Fortitude'}
            </span>
          </Link> */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600">
            Choose your wallet to connect to the application
          </p>
        </div>

        {/* Connection Status */}
        {isConnected && address && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">Connected</p>
                <p className="text-green-600 text-sm">{formatAddress(address)}</p>
                {chain?.id &&<p className="text-green-600 text-sm">Chain ID: {chain?.id}</p>}
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            {isRedirecting && (
              <p className="text-green-600 text-sm mt-2">
                Redirecting to homepage...
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error.message}</p>
          </div>
        )}

        {/* Connection Options */}
        <div className="space-y-3 mb-6">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                {getConnectorIcon(connector.name)}
                <div className="text-left">
                  <p className="font-medium text-gray-900">{connector.name}</p>
                  {/* {!connector.ready && (
                    <p className="text-xs text-red-500">Not available</p>
                  )} */}
                </div>
              </div>
              {status === 'pending' ? (
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Disconnect Button */}
        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
          >
            Disconnect Wallet
          </button>
        )}

        {/* Back to Home */}
        <Link
          href="/"
          className="block text-center text-indigo-600 hover:text-indigo-700 font-medium py-2"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}