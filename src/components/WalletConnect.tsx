import React from 'react';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { motion, AnimatePresence } from 'framer-motion';

export const WalletConnect: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    isLoading, 
    error, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        onClick={connectWallet}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 
                   text-white rounded-lg font-medium transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:shadow-lg hover:scale-105 active:scale-95"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Wallet className="w-4 h-4" />
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 
                   rounded-lg hover:bg-neutral-50 transition-all duration-200
                   shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 
                        rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-neutral-900">
            {formatAddress(address!)}
          </div>
          <div className="text-xs text-neutral-500">
            {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 
                                ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 
                       overflow-hidden z-50"
          >
            <div className="p-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 
                                rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Connected</div>
                  <div className="text-sm text-neutral-500">
                    {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 
                           rounded-md transition-colors duration-150"
              >
                <Copy className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-700">Copy Address</span>
              </button>

              <button
                onClick={openEtherscan}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 
                           rounded-md transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-700">View on Etherscan</span>
              </button>

              <div className="border-t border-neutral-100 my-2"></div>

              <button
                onClick={disconnectWallet}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-error-50 
                           rounded-md transition-colors duration-150 text-error-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 p-3 bg-error-50 border border-error-200 
                     rounded-lg text-sm text-error-700 max-w-xs"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};