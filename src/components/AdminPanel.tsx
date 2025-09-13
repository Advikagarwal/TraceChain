import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Eye,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const mockPendingProducers = [
  {
    id: 'P001',
    name: 'Green Valley Farm',
    location: 'California, USA',
    email: 'contact@greenvalley.com',
    farmSize: 150,
    certifications: ['USDA Organic', 'Fair Trade'],
    submittedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'P002',
    name: 'Sunrise Organic',
    location: 'Vermont, USA',
    email: 'info@sunriseorganic.com',
    farmSize: 85,
    certifications: ['USDA Organic', 'Biodynamic'],
    submittedAt: '2024-01-14T14:20:00Z',
  },
];

const mockSystemStats = {
  totalUsers: 1247,
  pendingVerifications: 12,
  totalBatches: 3456,
  avgQualityScore: 8.7,
  avgFairnessScore: 9.2,
  monthlyGrowth: 15.3,
};

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin
  if (!user || user.user_metadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h2>
          <p className="text-neutral-600">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'producers', label: 'Producer Verification', icon: Users },
    { id: 'batches', label: 'Batch Management', icon: Package },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleVerifyProducer = async (producerId: string, approved: boolean) => {
    try {
      // API call to verify/reject producer
      console.log(`${approved ? 'Approving' : 'Rejecting'} producer:`, producerId);
      // Remove from pending list
    } catch (error) {
      console.error('Failed to update producer status:', error);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-success-500" />
              <span className="text-sm font-medium text-success-500">
                +{change}%
              </span>
              <span className="text-xs text-neutral-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900">Admin Panel</h1>
          <p className="text-neutral-600 mt-2">
            Manage the TraceChain platform and oversee system operations
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Total Users"
                  value={mockSystemStats.totalUsers.toLocaleString()}
                  change={mockSystemStats.monthlyGrowth}
                  icon={<Users className="w-6 h-6 text-white" />}
                  color="bg-primary-500"
                />
                <StatCard
                  title="Pending Verifications"
                  value={mockSystemStats.pendingVerifications}
                  icon={<Shield className="w-6 h-6 text-white" />}
                  color="bg-warning-500"
                />
                <StatCard
                  title="Total Batches"
                  value={mockSystemStats.totalBatches.toLocaleString()}
                  change={12.5}
                  icon={<Package className="w-6 h-6 text-white" />}
                  color="bg-secondary-500"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Recent System Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'New producer registered', user: 'Green Valley Farm', time: '2 hours ago' },
                    { action: 'Batch quality assessed', batch: 'B001', time: '4 hours ago' },
                    { action: 'Producer verified', user: 'Sunrise Organic', time: '6 hours ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{activity.action}</p>
                        <p className="text-xs text-neutral-500">
                          {activity.user || activity.batch}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'producers' && (
            <motion.div
              key="producers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Pending Producer Verifications
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Review and approve new producer applications
                  </p>
                </div>
                <div className="divide-y divide-neutral-200">
                  {mockPendingProducers.map((producer) => (
                    <div key={producer.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900">{producer.name}</h4>
                          <p className="text-sm text-neutral-600 mt-1">{producer.location}</p>
                          <p className="text-sm text-neutral-600">{producer.email}</p>
                          <div className="mt-3">
                            <p className="text-sm text-neutral-700">
                              Farm Size: {producer.farmSize} acres
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {producer.certifications.map((cert) => (
                                <span
                                  key={cert}
                                  className="px-2 py-1 bg-accent-100 text-accent-700 
                                             text-xs rounded-full"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleVerifyProducer(producer.id, false)}
                            className="p-2 text-error-600 hover:bg-error-50 rounded-lg 
                                       transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleVerifyProducer(producer.id, true)}
                            className="p-2 text-success-600 hover:bg-success-50 rounded-lg 
                                       transition-colors"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg 
                                             transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'batches' && (
            <motion.div
              key="batches"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Batch Management
              </h3>
              <p className="text-neutral-600">
                Monitor and manage all agricultural batches in the system.
              </p>
              {/* Batch management interface would go here */}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                System Settings
              </h3>
              <p className="text-neutral-600">
                Configure platform settings and system parameters.
              </p>
              {/* System settings interface would go here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};