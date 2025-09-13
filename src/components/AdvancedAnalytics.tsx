import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Package,
  Award,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const mockAnalyticsData = {
  qualityTrends: [
    { month: 'Jan', avgQuality: 8.2, batches: 45 },
    { month: 'Feb', avgQuality: 8.4, batches: 52 },
    { month: 'Mar', avgQuality: 8.6, batches: 48 },
    { month: 'Apr', avgQuality: 8.8, batches: 61 },
    { month: 'May', avgQuality: 9.0, batches: 58 },
    { month: 'Jun', avgQuality: 9.2, batches: 67 },
  ],
  productDistribution: [
    { name: 'Organic Tomatoes', value: 35, color: '#22c55e' },
    { name: 'Free-Range Eggs', value: 25, color: '#3b82f6' },
    { name: 'Organic Carrots', value: 20, color: '#f59e0b' },
    { name: 'Heirloom Apples', value: 15, color: '#ef4444' },
    { name: 'Others', value: 5, color: '#8b5cf6' },
  ],
  fairnessScores: [
    { category: 'Labor Conditions', score: 9.2 },
    { category: 'Wage Equity', score: 8.8 },
    { category: 'Environmental Impact', score: 9.5 },
    { category: 'Community Benefit', score: 8.9 },
  ],
  regionalData: [
    { region: 'California', batches: 145, avgQuality: 9.1, avgFairness: 9.0 },
    { region: 'Oregon', batches: 89, avgQuality: 8.9, avgFairness: 9.2 },
    { region: 'Washington', batches: 76, avgQuality: 9.0, avgFairness: 8.8 },
    { region: 'Vermont', batches: 54, avgQuality: 8.8, avgFairness: 9.3 },
  ],
};

export const AdvancedAnalytics: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('quality');

  const exportData = () => {
    // Simulate data export
    const data = JSON.stringify(mockAnalyticsData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracechain-analytics.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Advanced Analytics
            </h1>
            <p className="text-lg text-neutral-600">
              Deep insights into supply chain performance and trends
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            
            <motion.button
              onClick={exportData}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                         rounded-lg font-medium transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Export Data
            </motion.button>
          </div>
        </motion.div>

        {/* Quality Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Quality Score Trends
              </h3>
              <p className="text-sm text-neutral-600">
                Average quality scores and batch volumes over time
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-success-500" />
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockAnalyticsData.qualityTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis yAxisId="quality" orientation="left" stroke="#666" fontSize={12} domain={[7, 10]} />
              <YAxis yAxisId="batches" orientation="right" stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                yAxisId="quality"
                type="monotone" 
                dataKey="avgQuality" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                name="Average Quality Score"
              />
              <Bar 
                yAxisId="batches"
                dataKey="batches" 
                fill="#3b82f6" 
                opacity={0.6}
                name="Number of Batches"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Product Distribution
                </h3>
                <p className="text-sm text-neutral-600">
                  Breakdown of products by type
                </p>
              </div>
              <PieChart className="w-5 h-5 text-accent-500" />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={mockAnalyticsData.productDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAnalyticsData.productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Fairness Scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Fairness Assessment
                </h3>
                <p className="text-sm text-neutral-600">
                  Average scores across fairness criteria
                </p>
              </div>
              <Award className="w-5 h-5 text-primary-500" />
            </div>

            <div className="space-y-4">
              {mockAnalyticsData.fairnessScores.map((item, index) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {item.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score * 10}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="bg-primary-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Regional Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Regional Performance
              </h3>
              <p className="text-sm text-neutral-600">
                Quality and fairness scores by region
              </p>
            </div>
            <Users className="w-5 h-5 text-secondary-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Batches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Avg Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Avg Fairness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {mockAnalyticsData.regionalData.map((region, index) => (
                  <motion.tr
                    key={region.region}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {region.batches}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-900">
                          {region.avgQuality}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-900">
                          {region.avgFairness}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-success-500" />
                        <span className="text-sm font-medium text-success-600">
                          Excellent
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};