import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Package,
  TrendingUp,
  Award,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockProducts = [
  {
    id: 'B001',
    name: 'Organic Tomatoes',
    producer: 'Green Valley Farm',
    location: 'California, USA',
    price: 4.50,
    priceChange: 5.2,
    quantity: '500 kg',
    harvestDate: '2024-01-15',
    qualityScore: 9.2,
    fairnessScore: 9.5,
    certifications: ['USDA Organic', 'Fair Trade'],
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium organic tomatoes grown with sustainable practices',
  },
  {
    id: 'B002',
    name: 'Free-Range Eggs',
    producer: 'Sunrise Poultry',
    location: 'Vermont, USA',
    price: 6.25,
    priceChange: -2.1,
    quantity: '200 dozen',
    harvestDate: '2024-01-16',
    qualityScore: 8.8,
    fairnessScore: 9.1,
    certifications: ['Certified Humane', 'Pasture Raised'],
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh eggs from pasture-raised hens with the highest welfare standards',
  },
  {
    id: 'B003',
    name: 'Organic Carrots',
    producer: 'Earth First Farm',
    location: 'Oregon, USA',
    price: 3.75,
    priceChange: 8.7,
    quantity: '300 kg',
    harvestDate: '2024-01-14',
    qualityScore: 9.0,
    fairnessScore: 8.9,
    certifications: ['USDA Organic', 'Biodynamic'],
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sweet, crunchy carrots grown using biodynamic farming methods',
  },
  {
    id: 'B004',
    name: 'Heirloom Apples',
    producer: 'Mountain View Orchards',
    location: 'Washington, USA',
    price: 5.80,
    priceChange: 3.4,
    quantity: '400 kg',
    harvestDate: '2024-01-13',
    qualityScore: 9.4,
    fairnessScore: 9.3,
    certifications: ['USDA Organic', 'Rainforest Alliance'],
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Heritage variety apples with exceptional flavor and nutritional value',
  },
];

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200 
                 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent-500 fill-current" />
            <span className="text-sm font-medium text-neutral-900">
              {product.qualityScore}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
            <p className="text-sm text-neutral-600">{product.producer}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-neutral-900">${product.price}</div>
            <div className={`text-sm flex items-center gap-1 ${
              product.priceChange > 0 ? 'text-success-600' : 'text-error-600'
            }`}>
              <TrendingUp className={`w-3 h-3 ${product.priceChange < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(product.priceChange)}%
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {product.location}
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {product.quantity}
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-neutral-600">
            <Calendar className="w-4 h-4" />
            Harvested {new Date(product.harvestDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-success-100 px-2 py-1 rounded-full">
              <Award className="w-3 h-3 text-success-600" />
              <span className="text-xs font-medium text-success-700">
                Quality {product.qualityScore}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-primary-100 px-2 py-1 rounded-full">
              <Leaf className="w-3 h-3 text-primary-600" />
              <span className="text-xs font-medium text-primary-700">
                Fairness {product.fairnessScore}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.certifications.slice(0, 2).map((cert: string) => (
              <span
                key={cert}
                className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 
                           text-xs rounded-full"
              >
                {cert}
              </span>
            ))}
            {product.certifications.length > 2 && (
              <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 
                               text-xs rounded-full">
                +{product.certifications.length - 2} more
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white 
                     rounded-lg font-medium transition-all duration-200
                     hover:shadow-lg"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export const MarketPlace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Products' },
    { id: 'organic', label: 'Organic' },
    { id: 'fair-trade', label: 'Fair Trade' },
    { id: 'local', label: 'Local' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            TraceChain Marketplace
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover premium agricultural products with verified quality and fairness scores
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products, producers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200 bg-white"
              >
                {filters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-white border border-neutral-300 text-neutral-700 
                             rounded-lg font-medium hover:bg-neutral-50 transition-all duration-200
                             hover:shadow-md">
            Load More Products
          </button>
        </motion.div>
      </div>
    </div>
  );
};