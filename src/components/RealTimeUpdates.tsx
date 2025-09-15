import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Package, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';

interface RealTimeUpdate {
  id: string;
  type: 'batch_update' | 'quality_assessment' | 'producer_verification' | 'price_alert';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

export const RealTimeUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  const { emit } = useSocket({
    onBatchUpdate: (data) => {
      const update: RealTimeUpdate = {
        id: Date.now().toString(),
        type: 'batch_update',
        title: 'Batch Status Updated',
        message: `Batch ${data.batch_id} moved to ${data.stage}`,
        timestamp: new Date().toISOString(),
        data,
      };
      addUpdate(update);
    },
    onQualityAssessment: (data) => {
      const update: RealTimeUpdate = {
        id: Date.now().toString(),
        type: 'quality_assessment',
        title: 'Quality Assessment Complete',
        message: `Batch ${data.batch_id} scored ${data.overall_score}/10`,
        timestamp: new Date().toISOString(),
        data,
      };
      addUpdate(update);
    },
    onProducerVerification: (data) => {
      const update: RealTimeUpdate = {
        id: Date.now().toString(),
        type: 'producer_verification',
        title: 'Producer Verification Update',
        message: data.message,
        timestamp: new Date().toISOString(),
        data,
      };
      addUpdate(update);
    },
    onNotification: (data) => {
      const update: RealTimeUpdate = {
        id: Date.now().toString(),
        type: 'price_alert',
        title: data.title,
        message: data.message,
        timestamp: new Date().toISOString(),
        data,
      };
      addUpdate(update);
    },
  });

  const addUpdate = (update: RealTimeUpdate) => {
    setUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep only last 10 updates
    setIsVisible(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'batch_update':
        return <Package className="w-4 h-4 text-primary-500" />;
      case 'quality_assessment':
        return <TrendingUp className="w-4 h-4 text-success-500" />;
      case 'producer_verification':
        return <Users className="w-4 h-4 text-accent-500" />;
      case 'price_alert':
        return <Bell className="w-4 h-4 text-warning-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!user || updates.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <AnimatePresence>
        {isVisible && updates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary-500" />
                  Live Updates
                </h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {updates.slice(0, 3).map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border-b border-neutral-50 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {getUpdateIcon(update.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900 text-sm">
                        {update.title}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        {update.message}
                      </p>
                      <span className="text-xs text-neutral-500 mt-1 block">
                        {getTimeAgo(update.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {updates.length > 3 && (
              <div className="p-3 bg-neutral-50 text-center">
                <span className="text-xs text-neutral-500">
                  +{updates.length - 3} more updates
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};