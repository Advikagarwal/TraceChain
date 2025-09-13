import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Leaf, 
  Package, 
  TrendingUp,
  Users,
  Shield,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockProducer = {
  id: 'P001',
  name: 'Green Valley Farm',
  location: 'Sonoma County, California',
  description: 'A family-owned organic farm committed to sustainable agriculture and fair labor practices. We specialize in heirloom vegetables and have been serving our community for over 30 years.',
  farmSize: 150,
  joinedDate: '2023-06-15',
  verificationStatus: 'verified',
  qualityScore: 9.2,
  fairnessScore: 9.5,
  totalBatches: 47,
  certifications: ['USDA Organic', 'Fair Trade Certified', 'Biodynamic', 'Rainforest Alliance'],
  sustainabilityPractices: [
    'Water Conservation',
    'Soil Health Management',
    'Renewable Energy Use',
    'Biodiversity Protection',
    'Carbon Sequestration',
  ],
  avatar: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400',
  performanceData: [
    { month: 'Jul', quality: 8.8, fairness: 9.1 },
    { month: 'Aug', quality: 9.0, fairness: 9.2 },
    { month: 'Sep', quality: 9.1, fairness: 9.3 },
    { month: 'Oct', quality: 9.0, fairness: 9.4 },
    { month: 'Nov', quality: 9.2, fairness: 9.5 },
    { month: 'Dec', quality: 9.2, fairness: 9.5 },
  ],
  recentBatches: [
    {
      id: 'B001',
      product: 'Organic Tomatoes',
      quantity: '500 kg',
      harvestDate: '2024-01-15',
      status: 'shipped',
      qualityScore: 9.2,
    },
    {
      id: 'B005',
      product: 'Organic Lettuce',
      quantity: '200 kg',
      harvestDate: '2024-01-12',
      status: 'delivered',
      qualityScore: 8.9,
    },
    {
      id: 'B008',
      product: 'Organic Peppers',
      quantity: '300 kg',
      harvestDate: '2024-01-10',
      status: 'delivered',
      qualityScore: 9.1,
    },
  ],
};

export const ProducerProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={mockProducer.avatar}
                alt={mockProducer.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                    {mockProducer.name}
                  </h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mockProducer.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(mockProducer.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-success-100 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-success-600" />
                  <span className="text-sm font-medium text-success-700">Verified</span>
                </div>
              </div>
              
              <p className="text-neutral-700 mb-6">{mockProducer.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{mockProducer.qualityScore}</div>
                  <div className="text-sm text-neutral-600">Quality Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{mockProducer.fairnessScore}</div>
                  <div className="text-sm text-neutral-600">Fairness Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">{mockProducer.totalBatches}</div>
                  <div className="text-sm text-neutral-600">Total Batches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">{mockProducer.farmSize}</div>
                  <div className="text-sm text-neutral-600">Acres</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockProducer.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} domain={[8, 10]} />
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
                  dataKey="quality" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  name="Quality Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="fairness" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Fairness Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Certifications & Practices */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Certifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-500" />
                Certifications
              </h3>
              <div className="space-y-2">
                {mockProducer.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-2 p-2 bg-accent-50 rounded-lg"
                  >
                    <Award className="w-4 h-4 text-accent-600" />
                    <span className="text-sm font-medium text-accent-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sustainability Practices */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-success-500" />
                Sustainability
              </h3>
              <div className="space-y-2">
                {mockProducer.sustainabilityPractices.map((practice) => (
                  <div
                    key={practice}
                    className="flex items-center gap-2 p-2 bg-success-50 rounded-lg"
                  >
                    <Leaf className="w-4 h-4 text-success-600" />
                    <span className="text-sm font-medium text-success-700">{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Batches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-neutral-200"
        >
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Batches</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockProducer.recentBatches.map((batch, index) => (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 
                             transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">{batch.product}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      batch.status === 'delivered' 
                        ? 'bg-success-100 text-success-700'
                        : 'bg-accent-100 text-accent-700'
                    }`}>
                      {batch.status}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <div>Quantity: {batch.quantity}</div>
                    <div>Quality: {batch.qualityScore}/10</div>
                    <div>Harvested: {new Date(batch.harvestDate).toLocaleDateString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};