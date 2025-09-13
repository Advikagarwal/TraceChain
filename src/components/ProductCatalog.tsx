import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Package,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { PaymentIntegration } from './PaymentIntegration';

interface Product {
  id: string;
  name: string;
  producer: string;
  location: string;
  price: number;
  quantity: string;
  harvestDate: string;
  qualityScore: number;
  fairnessScore: number;
  certifications: string[];
  image: string;
  description: string;
  inStock: boolean;
}

const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Organic Heirloom Tomatoes',
    producer: 'Green Valley Farm',
    location: 'California, USA',
    price: 8.99,
    quantity: '2 lbs',
    harvestDate: '2024-01-15',
    qualityScore: 9.2,
    fairnessScore: 9.5,
    certifications: ['USDA Organic', 'Fair Trade'],
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium heirloom tomatoes with exceptional flavor and nutritional value.',
    inStock: true,
  },
  {
    id: 'P002',
    name: 'Free-Range Organic Eggs',
    producer: 'Sunrise Poultry',
    location: 'Vermont, USA',
    price: 12.50,
    quantity: '1 dozen',
    harvestDate: '2024-01-16',
    qualityScore: 8.8,
    fairnessScore: 9.1,
    certifications: ['Certified Humane', 'Pasture Raised'],
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh eggs from pasture-raised hens with the highest welfare standards.',
    inStock: true,
  },
  {
    id: 'P003',
    name: 'Organic Rainbow Carrots',
    producer: 'Earth First Farm',
    location: 'Oregon, USA',
    price: 6.75,
    quantity: '1.5 lbs',
    harvestDate: '2024-01-14',
    qualityScore: 9.0,
    fairnessScore: 8.9,
    certifications: ['USDA Organic', 'Biodynamic'],
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Colorful heritage carrots grown using biodynamic farming methods.',
    inStock: true,
  },
];

export const ProductCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.producer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'organic') return matchesSearch && product.certifications.some(cert => cert.includes('Organic'));
    if (selectedFilter === 'fair-trade') return matchesSearch && product.certifications.some(cert => cert.includes('Fair Trade'));
    
    return matchesSearch;
  });

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    setShowPayment(false);
    setSelectedProduct(null);
  };

  if (showPayment && selectedProduct) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => setShowPayment(false)}
            className="mb-6 text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Products
          </button>
          <PaymentIntegration
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            price={selectedProduct.price}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    );
  }

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
                <option value="all">All Products</option>
                <option value="organic">Organic</option>
                <option value="fair-trade">Fair Trade</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
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
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-error-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
                    <p className="text-sm text-neutral-600">{product.producer}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-neutral-900">${product.price}</div>
                    <div className="text-sm text-neutral-500">{product.quantity}</div>
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
                      <Calendar className="w-4 h-4" />
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-success-100 px-2 py-1 rounded-full">
                      <Package className="w-3 h-3 text-success-600" />
                      <span className="text-xs font-medium text-success-700">
                        Quality {product.qualityScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-primary-100 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-primary-600" />
                      <span className="text-xs font-medium text-primary-700">
                        Fairness {product.fairnessScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.certifications.slice(0, 2).map((cert) => (
                      <span
                        key={cert}
                        className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 
                                   text-xs rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 border border-neutral-300 text-neutral-700 
                               rounded-lg font-medium hover:bg-neutral-50 transition-colors
                               flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handlePurchase(product)}
                    disabled={!product.inStock}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                               rounded-lg font-medium transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};