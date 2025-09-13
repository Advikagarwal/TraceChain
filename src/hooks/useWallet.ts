import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types/blockchain';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    isLoading: false,
    error: null,
  });

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const checkConnection = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        setWalletState({
          isConnected: true,
          address,
          balance: ethers.formatEther(balance),
          chainId: Number(network.chainId),
          isLoading: false,
          error: null,
        });

        setProvider(provider);
        setSigner(signer);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkConnection();
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, [checkConnection]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      isLoading: false,
      error: null,
    });
    setProvider(null);
    setSigner(null);
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        setWalletState(prev => ({
          ...prev,
          error: 'Please add this network to MetaMask',
        }));
      } else {
        setWalletState(prev => ({
          ...prev,
          error: error.message || 'Failed to switch network',
        }));
      }
    }
  }, []);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection, disconnectWallet]);

  return {
    ...walletState,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};