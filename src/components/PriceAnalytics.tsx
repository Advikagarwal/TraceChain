import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrentPrice, usePriceForecast } from '../hooks/useApi';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { PRODUCT_TYPES } from '../constants';

const mockPriceData = [
  { date: '2024-01-01', price: 4.20, volume: 1200 },
  { date: '2024-01-02', price: 4.35, volume: 1350 },
  { date: '2024-01-03', price: 4.28, volume: 1180 },
  { date: '2024-01-04', price: 4.45, volume: 1420 },
  { date: '2024-01-05', price: 4.52, volume: 1380 },
  { date: '2024-01-06', price: 4.38, volume: 1250 },
  { date: '2024-01-07', price: 4.60, volume: 1480 },
];

const mockForecast = [
  { date: '2024-01-08', price: 4.65, confidence: 0.95 },
  { date: '2024-01-09', price: 4.72, confidence: 0.92 },
  { date: '2024-01-10', price: 4.68, confidence: 0.89 },
  { date: '2024-01-11', price: 4.75, confidence: 0.86 },
  { date: '2024-01-12', price: 4.80, confidence: 0.83 },
];

export const PriceAnalytics: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState('Organic Tomatoes');
  const [timeRange, setTimeRange] = useState('7d');

  const currentPrice = 4.60;
  const priceChange = 8.7;
  const volume = 1480;

  const combinedData = [
    ...mockPriceData.map(d => ({ ...d, type: 'historical' })),
    ...mockForecast.map(d => ({ ...d, type: 'forecast', volume: null })),
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-neutral-200 rounded-lg shadow-lg">
          <p className="font-medium text-neutral-900 mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-primary-600">
              Price: {formatCurrency(data.price)}
            </p>
            {data.volume && (
              <p className="text-sm text-neutral-600">
                Volume: {data.volume} kg
              </p>
            )}
            {data.confidence && (
              <p className="text-sm text-accent-600">
                Confidence: {formatPercentage(data.confidence * 100)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Price Analytics & Forecasting
          </h1>
          <p className="text-lg text-neutral-600">
            Real-time pricing data and AI-powered market forecasts
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Type
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              >
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Price Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div className={`flex items-center gap-1 ${
                priceChange > 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                {priceChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(priceChange)}%
                </span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Current Price
            </h3>
            <p className="text-2xl font-bold text-neutral-900">
              {formatCurrency(currentPrice)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">per kg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="text-success-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Trading Volume
            </h3>
            <p className="text-2xl font-bold text-neutral-900">
              {volume.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500 mt-1">kg traded today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
              <div className="text-primary-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              7-Day Forecast
            </h3>
            <p className="text-2xl font-bold text-neutral-900">
              {formatCurrency(4.75)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">predicted peak</p>
          </motion.div>
        </div>

        {/* Price Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Price History & Forecast
              </h3>
              <p className="text-sm text-neutral-600">
                {selectedProduct} - Historical data and AI predictions
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-neutral-600">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-500 rounded-full border-2 border-accent-200"></div>
                <span className="text-neutral-600">Forecast</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={(props) => {
                  const { payload } = props;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={payload?.type === 'forecast' ? 4 : 3}
                      fill={payload?.type === 'forecast' ? '#f59e0b' : '#22c55e'}
                      stroke={payload?.type === 'forecast' ? '#fbbf24' : '#16a34a'}
                      strokeWidth={2}
                      strokeDasharray={payload?.type === 'forecast' ? '5,5' : '0'}
                    />
                  );
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Market Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">Price Drivers</h4>
              <div className="space-y-2">
                {[
                  { factor: 'Seasonal demand increase', impact: '+12%' },
                  { factor: 'Weather conditions favorable', impact: '+5%' },
                  { factor: 'Supply chain efficiency', impact: '+3%' },
                  { factor: 'Organic certification premium', impact: '+8%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                    <span className="text-sm text-neutral-700">{item.factor}</span>
                    <span className="text-sm font-medium text-success-600">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {[
                  'Consider harvesting within next 3-5 days for optimal pricing',
                  'Current market conditions favor organic certification',
                  'Regional demand is 15% above seasonal average',
                  'Price volatility expected to decrease next week',
                ].map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-primary-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};