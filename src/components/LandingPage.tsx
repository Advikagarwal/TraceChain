import React from 'react';
import { 
  Leaf, 
  Shield, 
  Eye, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 
               hover:shadow-lg transition-all duration-300"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
    <p className="text-neutral-600 leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard: React.FC<{
  value: string;
  label: string;
  icon: React.ReactNode;
}> = ({ value, label, icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-primary-100">{label}</div>
  </motion.div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 
                          text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Transparent
                <span className="block text-accent-300">Agricultural</span>
                Supply Chain
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Revolutionizing agriculture with blockchain technology, AI-powered quality 
                assessment, and ethical farming verification. From farm to table, every step verified.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold 
                             hover:bg-primary-50 transition-all duration-200
                             hover:shadow-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold 
                             hover:bg-white/10 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <StatCard
                    value="1,247"
                    label="Tracked Batches"
                    icon={<Package className="w-8 h-8 text-white" />}
                  />
                  <StatCard
                    value="89"
                    label="Verified Farms"
                    icon={<Users className="w-8 h-8 text-white" />}
                  />
                  <StatCard
                    value="9.2"
                    label="Avg Quality Score"
                    icon={<Award className="w-8 h-8 text-white" />}
                  />
                  <StatCard
                    value="98%"
                    label="Transparency Rate"
                    icon={<Eye className="w-8 h-8 text-white" />}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Revolutionizing Agriculture
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with agricultural expertise 
              to create a more transparent, fair, and sustainable food system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-white" />}
              title="Blockchain Verification"
              description="Immutable records ensure complete transparency and traceability from farm to consumer, building trust in every transaction."
              color="bg-primary-500"
            />
            <FeatureCard
              icon={<Eye className="w-6 h-6 text-white" />}
              title="AI Quality Assessment"
              description="Advanced computer vision and machine learning algorithms provide objective quality scoring for all agricultural products."
              color="bg-secondary-500"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Fairness Verification"
              description="Comprehensive evaluation of labor conditions, wage equity, and community impact ensures ethical farming practices."
              color="bg-accent-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Market Analytics"
              description="Real-time pricing data and market forecasts help farmers make informed decisions and optimize their operations."
              color="bg-success-500"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-white" />}
              title="Global Network"
              description="Connect with producers, distributors, and consumers worldwide through our decentralized marketplace platform."
              color="bg-error-500"
            />
            <FeatureCard
              icon={<Smartphone className="w-6 h-6 text-white" />}
              title="Mobile-First Design"
              description="Optimized for field use with offline capabilities, ensuring farmers can access the platform anywhere, anytime."
              color="bg-purple-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              How AgriTrust Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              A simple, three-step process that transforms agricultural supply chains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register & Verify',
                description: 'Producers register on the platform and undergo comprehensive verification including certifications and sustainability practices.',
                icon: <Users className="w-8 h-8 text-primary-600" />,
              },
              {
                step: '02',
                title: 'Track & Assess',
                description: 'Each batch receives AI-powered quality and fairness assessments, creating an immutable NFT record on the blockchain.',
                icon: <Award className="w-8 h-8 text-primary-600" />,
              },
              {
                step: '03',
                title: 'Trade & Trace',
                description: 'Consumers can trace products from farm to table, making informed purchasing decisions based on verified data.',
                icon: <Eye className="w-8 h-8 text-primary-600" />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of producers, distributors, and consumers who are building 
              a more transparent and sustainable food system.
            </p>
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold 
                         hover:bg-primary-50 transition-all duration-200
                         hover:shadow-lg flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};