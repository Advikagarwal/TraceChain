import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const mockInsights = [
  {
    id: '1',
    type: 'price_increase',
    title: 'Organic Tomatoes Price Surge',
    message: 'Prices increased 12% due to seasonal demand',
    impact: 'positive',
    confidence: 0.92,
    timestamp: '2024-01-16T10:30:00Z',
  },
  {
    id: '2',
    type: 'supply_shortage',
    title: 'Regional Supply Shortage',
    message: 'California experiencing 15% supply reduction',
    impact: 'negative',
    confidence: 0.87,
    timestamp: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    type: 'quality_improvement',
    title: 'Quality Scores Rising',
    message: 'Average quality scores up 8% this month',
    impact: 'positive',
    confidence: 0.95,
    timestamp: '2024-01-16T08:45:00Z',
  },
];

export const MarketInsights: React.FC = () => {
  const getIcon = (type: string, impact: string) => {
    switch (type) {
      case 'price_increase':
        return impact === 'positive' ? (
          <TrendingUp className="w-5 h-5 text-success-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-error-500" />
        );
      case 'supply_shortage':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'quality_improvement':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      default:
        return <BarChart3 className="w-5 h-5 text-primary-500" />;
    }
  };

  const getBorderColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-l-success-500';
      case 'negative':
        return 'border-l-error-500';
      default:
        return 'border-l-warning-500';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Market Insights</h3>
          <p className="text-sm text-neutral-600">AI-powered market analysis</p>
        </div>
        <BarChart3 className="w-5 h-5 text-primary-500" />
      </div>

      <div className="space-y-4">
        {mockInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border-l-4 ${getBorderColor(insight.impact)} bg-neutral-50 rounded-r-lg`}
          >
            <div className="flex items-start gap-3">
              {getIcon(insight.type, insight.impact)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-neutral-900 text-sm">
                    {insight.title}
                  </h4>
                  <span className="text-xs text-neutral-500">
                    {getTimeAgo(insight.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">
                  {insight.message}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs text-neutral-500">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 
                           font-medium transition-colors">
          View All Insights
        </button>
      </div>
    </motion.div>
  );
};