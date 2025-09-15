import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, MapPin, Clock, CheckCircle } from 'lucide-react';

interface BatchTrackingWidgetProps {
  className?: string;
}

export const BatchTrackingWidget: React.FC<BatchTrackingWidgetProps> = ({ 
  className = '' 
}) => {
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleQuickTrack = async () => {
    if (!trackingId.trim()) return;
    
    setIsTracking(true);
    // Simulate tracking lookup
    setTimeout(() => {
      setIsTracking(false);
      // In a real app, this would navigate to the full tracker
      console.log('Tracking:', trackingId);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-neutral-200 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900">Quick Track</h3>
          <p className="text-sm text-neutral-600">Enter batch ID to track</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuickTrack()}
          placeholder="B001, T1001, or scan QR"
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-200 text-sm"
        />
        <motion.button
          onClick={handleQuickTrack}
          disabled={isTracking || !trackingId.trim()}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                     rounded-lg font-medium transition-colors text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isTracking ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Recent Tracks */}
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <p className="text-xs font-medium text-neutral-500 mb-2">Recent Tracks</p>
        <div className="space-y-2">
          {['B001', 'B005', 'B008'].map((id) => (
            <button
              key={id}
              onClick={() => setTrackingId(id)}
              className="w-full flex items-center justify-between p-2 hover:bg-neutral-50 
                         rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full" />
                <span className="text-sm text-neutral-700">{id}</span>
              </div>
              <CheckCircle className="w-3 h-3 text-success-500" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};