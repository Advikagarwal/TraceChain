import React, { useState } from 'react';
import { Search, MapPin, Calendar, User, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockBatchData = {
  id: 'B001',
  tokenId: 1001,
  product: 'Organic Tomatoes',
  producer: 'Green Valley Farm',
  quantity: '500 kg',
  harvestDate: '2024-01-15',
  currentStage: 'shipped',
  qualityScore: 9.2,
  fairnessScore: 9.5,
  supplyChain: [
    {
      stage: 'harvested',
      timestamp: '2024-01-15T08:00:00Z',
      location: 'Green Valley Farm, California',
      actor: 'John Smith',
      description: 'Organic tomatoes harvested at peak ripeness',
      verified: true,
    },
    {
      stage: 'processed',
      timestamp: '2024-01-15T14:30:00Z',
      location: 'Valley Processing Center',
      actor: 'Processing Team',
      description: 'Quality inspection and packaging completed',
      verified: true,
    },
    {
      stage: 'shipped',
      timestamp: '2024-01-16T09:15:00Z',
      location: 'Distribution Hub, Los Angeles',
      actor: 'Fresh Logistics',
      description: 'Shipped to retail distribution center',
      verified: true,
    },
    {
      stage: 'delivered',
      timestamp: '2024-01-17T11:45:00Z',
      location: 'Whole Foods Market, Beverly Hills',
      actor: 'Retail Partner',
      description: 'Delivered to retail location',
      verified: false,
    },
  ],
};

const StageIcon: React.FC<{ stage: string; isActive: boolean; isCompleted: boolean }> = ({ 
  stage, 
  isActive, 
  isCompleted 
}) => {
  const getIcon = () => {
    switch (stage) {
      case 'harvested':
        return <Package className="w-5 h-5" />;
      case 'processed':
        return <User className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    if (isCompleted) return 'bg-success-500 text-white';
    if (isActive) return 'bg-primary-500 text-white';
    return 'bg-neutral-200 text-neutral-400';
  };

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColors()}`}>
      {getIcon()}
    </div>
  );
};

export const SupplyChainTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResult(mockBatchData);
      setIsLoading(false);
    }, 1000);
  };

  const getCurrentStageIndex = () => {
    return mockBatchData.supplyChain.findIndex(event => event.stage === mockBatchData.currentStage);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Supply Chain Tracker
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Track your produce from farm to table with complete transparency and verification
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Enter batch ID, NFT token ID, or QR code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              />
            </div>
            <motion.button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white 
                         rounded-lg font-medium transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Searching...' : 'Track'}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Batch Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                      {searchResult.product}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-neutral-400" />
                        <span className="text-neutral-600">Producer:</span>
                        <span className="font-medium text-neutral-900">{searchResult.producer}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-neutral-400" />
                        <span className="text-neutral-600">Quantity:</span>
                        <span className="font-medium text-neutral-900">{searchResult.quantity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-neutral-400" />
                        <span className="text-neutral-600">Harvest Date:</span>
                        <span className="font-medium text-neutral-900">
                          {new Date(searchResult.harvestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-success-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-success-700">Quality Score</span>
                        <span className="text-2xl font-bold text-success-700">
                          {searchResult.qualityScore}/10
                        </span>
                      </div>
                      <div className="w-full bg-success-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-success-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${searchResult.qualityScore * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary-700">Fairness Score</span>
                        <span className="text-2xl font-bold text-primary-700">
                          {searchResult.fairnessScore}/10
                        </span>
                      </div>
                      <div className="w-full bg-primary-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${searchResult.fairnessScore * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supply Chain Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">Supply Chain Journey</h3>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-neutral-200"></div>
                  
                  <div className="space-y-8">
                    {searchResult.supplyChain.map((event: any, index: number) => {
                      const isCompleted = index <= getCurrentStageIndex();
                      const isActive = index === getCurrentStageIndex();
                      
                      return (
                        <motion.div
                          key={event.stage}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="relative flex items-start gap-4"
                        >
                          <StageIcon 
                            stage={event.stage} 
                            isActive={isActive} 
                            isCompleted={isCompleted} 
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-neutral-900 capitalize">
                                {event.stage}
                              </h4>
                              {event.verified && (
                                <CheckCircle className="w-5 h-5 text-success-500" />
                              )}
                            </div>
                            
                            <p className="text-neutral-600 mb-2">{event.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {event.actor}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!searchResult && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Track Your Produce
            </h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              Enter a batch ID, NFT token ID, or scan a QR code to view the complete 
              supply chain journey of your agricultural products.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};