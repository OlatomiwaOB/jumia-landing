// hooks/useTronLink.ts
import { useState, useEffect } from 'react';

interface TronLinkState {
  address: string | null;
  isConnected: boolean;
  tronWeb: any;
}

export const useTronLink = () => {
  const [state, setState] = useState<TronLinkState>({
    address: null,
    isConnected: false,
    tronWeb: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if TronLink is installed
  const checkTronLink = () => {
    if (typeof window !== 'undefined') {
      return window.tronWeb && window.tronWeb.defaultAddress.base58;
    }
    return false;
  };

  // Connect to TronLink
  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Window is not defined');
      }

      if (!window.tronWeb || !window.tronWeb.ready) {
        throw new Error('TronLink is not installed or not ready');
      }

      // Request account access
      const tronWeb = window.tronWeb;
      
      if (tronWeb.defaultAddress.base58) {
        setState({
          address: tronWeb.defaultAddress.base58,
          isConnected: true,
          tronWeb: tronWeb,
        });
      } else {
        throw new Error('Please unlock TronLink wallet');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('TronLink connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect
  const disconnect = () => {
    setState({
      address: null,
      isConnected: false,
      tronWeb: null,
    });
  };

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (checkTronLink()) {
        const tronWeb = window.tronWeb;
        setState({
          address: tronWeb.defaultAddress.base58,
          isConnected: true,
          tronWeb: tronWeb,
        });
      }
    };

    // Wait for TronLink to inject
    const timer = setTimeout(() => {
      checkConnection();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAccountsChanged = () => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        setState({
          address: window.tronWeb.defaultAddress.base58,
          isConnected: true,
          tronWeb: window.tronWeb,
        });
      } else {
        disconnect();
      }
    };

    // TronLink emits message events
    const messageHandler = (e: MessageEvent) => {
      if (e.data.message && e.data.message.action === 'accountsChanged') {
        handleAccountsChanged();
      }
      if (e.data.message && e.data.message.action === 'setAccount') {
        handleAccountsChanged();
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    isLoading,
    error,
    isTronLinkInstalled: checkTronLink(),
  };
};

// Type declaration for window.tronWeb
declare global {
  interface Window {
    tronWeb: any;
  }
}