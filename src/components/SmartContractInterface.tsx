import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Copy,
  Zap
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useMintNFT } from '../hooks/useApi';
import { useToast } from './Toast';
import { formatAddress } from '../utils/formatters';

interface SmartContractInterfaceProps {
  batchId?: string;
}

export const SmartContractInterface: React.FC<SmartContractInterfaceProps> = ({ 
  batchId 
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { isConnected, address, signer } = useWallet();
  const { showToast } = useToast();
  const mintNFT = useMintNFT();

  const handleMintNFT = async () => {
    if (!batchId || !signer) return;

    setIsInteracting(true);
    try {
      const result = await mintNFT.mutateAsync({ batchId });
      setTxHash(result.transactionHash);
      
      showToast({
        type: 'success',
        title: 'NFT Minted Successfully',
        message: 'Your batch has been tokenized on the blockchain.',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Minting Failed',
        message: error.message || 'Failed to mint NFT.',
      });
    } finally {
      setIsInteracting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'success',
      title: 'Copied',
      message: 'Address copied to clipboard',
    });
  };

  const openEtherscan = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-secondary-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Smart Contract Interface
          </h2>
          <p className="text-neutral-600">
            Interact with the TraceChain blockchain contract
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Wallet Not Connected
            </h3>
            <p className="text-neutral-600 mb-6">
              Connect your wallet to interact with smart contracts
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Wallet Info */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Connected Wallet
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Address</p>
                  <p className="font-mono text-neutral-900">{formatAddress(address!)}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(address!)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                             hover:bg-neutral-100 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contract Actions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Contract Actions
              </h3>

              {/* Mint NFT */}
              <div className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-neutral-900">Mint Batch NFT</h4>
                    <p className="text-sm text-neutral-600">
                      Create an NFT token for this batch on the blockchain
                    </p>
                  </div>
                  <motion.button
                    onClick={handleMintNFT}
                    disabled={!batchId || isInteracting}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                               rounded-lg font-medium transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:shadow-lg flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-4 h-4" />
                    {isInteracting ? 'Minting...' : 'Mint NFT'}
                  </motion.button>
                </div>

                {!batchId && (
                  <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-warning-600" />
                      <span className="text-sm text-warning-700">
                        Select a batch to mint NFT
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction Result */}
              {txHash && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-success-50 border border-success-200 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                    <div>
                      <h4 className="font-medium text-success-900">
                        Transaction Successful
                      </h4>
                      <p className="text-sm text-success-700">
                        Your NFT has been minted successfully
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Transaction Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-neutral-900">
                          {formatAddress(txHash)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(txHash)}
                          className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => openEtherscan(txHash)}
                          className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Contract Information */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Contract Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Contract Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-neutral-900">
                      0x1234...5678
                    </span>
                    <button
                      onClick={() => copyToClipboard('0x1234567890123456789012345678901234567890')}
                      className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Network:</span>
                  <span className="text-sm text-neutral-900">Ethereum Mainnet</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Token Standard:</span>
                  <span className="text-sm text-neutral-900">ERC-721</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};