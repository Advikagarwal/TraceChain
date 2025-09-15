import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Shield, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BatchTrackingWidget } from './BatchTrackingWidget';
import { MarketInsights } from './MarketInsights';
import { RealTimeUpdates } from './RealTimeUpdates';

const mockData = {
  stats: {
    totalBatches: 1247,
    activeFarms: 89,
    avgQualityScore: 8.7,
    avgFairnessScore: 9.2,
  },
  priceData: [
    { month: 'Jan', organic: 4.2, conventional: 2.8 },
    { month: 'Feb', organic: 4.5, conventional: 3.1 },
    { month: 'Mar', organic: 4.8, conventional: 3.3 },
    { month: 'Apr', organic: 5.1, conventional: 3.6 },
    { month: 'May', organic: 5.3, conventional: 3.8 },
    { month: 'Jun', organic: 5.6, conventional: 4.1 },
  ],
  qualityTrends: [
    { week: 'W1', score: 8.2 },
    { week: 'W2', score: 8.4 },
    { week: 'W3', score: 8.6 },
    { week: 'W4', score: 8.7 },
  ],
  recentBatches: [
    {
      id: 'B001',
      product: 'Organic Tomatoes',
      producer: 'Green Valley Farm',
      quality: 9.2,
      fairness: 9.5,
      status: 'shipped',
    },
    {
      id: 'B002',
      product: 'Free-Range Eggs',
      producer: 'Sunrise Poultry',
      quality: 8.8,
      fairness: 9.1,
      status: 'delivered',
    },
    {
      id: 'B003',
      product: 'Organic Carrots',
      producer: 'Earth First Farm',
      quality: 9.0,
      fairness: 8.9,
      status: 'processed',
    },
  ],
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, icon, color }) => {
  const getTrendIcon = () => {
    if (!change) return <Minus className="w-4 h-4 text-neutral-400" />;
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-success-500" />;
    return <ArrowDownRight className="w-4 h-4 text-error-500" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-neutral-400';
    return change > 0 ? 'text-success-500' : 'text-error-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md 
                 transition-all duration-200"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-neutral-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <p className="text-neutral-600">Loading TraceChain...</p>
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-2">
            Monitor your agricultural supply chain performance and insights
          </p>
        </motion.div>

        {/* Quick Actions and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <BatchTrackingWidget />
          <div className="lg:col-span-2">
            <MarketInsights />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Batches"
            value={mockData.stats.totalBatches.toLocaleString()}
            change={12.5}
            icon={<Package className="w-6 h-6 text-white" />}
            color="bg-primary-500"
          />
          <StatCard
            title="Active Farms"
            value={mockData.stats.activeFarms}
            change={8.2}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-secondary-500"
          />
          <StatCard
            title="Avg Quality Score"
            value={mockData.stats.avgQualityScore}
            change={3.1}
            icon={<Award className="w-6 h-6 text-white" />}
            color="bg-accent-500"
          />
          <StatCard
            title="Avg Fairness Score"
            value={mockData.stats.avgFairnessScore}
            change={1.8}
            icon={<Shield className="w-6 h-6 text-white" />}
            color="bg-success-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Price Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Price Trends</h3>
                <p className="text-sm text-neutral-600">Organic vs Conventional pricing</p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="organic" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conventional" 
                  stroke="#94a3b8" 
                  strokeWidth={3}
                  dot={{ fill: '#94a3b8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quality Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Quality Trends</h3>
                <p className="text-sm text-neutral-600">Weekly average quality scores</p>
              </div>
              <Award className="w-5 h-5 text-accent-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.qualityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} domain={[7, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Batches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200"
        >
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Batches</h3>
            <p className="text-sm text-neutral-600">Latest supply chain activities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Producer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Fairness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {mockData.recentBatches.map((batch, index) => (
                  <motion.tr
                    key={batch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {batch.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {batch.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {batch.producer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-900">{batch.quality}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-900">{batch.fairness}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        batch.status === 'delivered' 
                          ? 'bg-success-100 text-success-800'
                          : batch.status === 'shipped'
                          ? 'bg-accent-100 text-accent-800'
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Real-time Updates */}
        <RealTimeUpdates />
      </div>
    </div>
  );
};