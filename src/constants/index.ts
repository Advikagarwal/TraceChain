export const APP_NAME = 'AgriTrust';
export const APP_DESCRIPTION = 'Decentralized Agricultural Supply Chain Platform';

export const SUPPLY_CHAIN_STAGES = [
  { id: 'harvested', label: 'Harvested', color: 'bg-accent-500' },
  { id: 'processed', label: 'Processed', color: 'bg-secondary-500' },
  { id: 'packaged', label: 'Packaged', color: 'bg-primary-500' },
  { id: 'shipped', label: 'Shipped', color: 'bg-warning-500' },
  { id: 'delivered', label: 'Delivered', color: 'bg-success-500' },
];

export const CERTIFICATION_OPTIONS = [
  'USDA Organic',
  'Fair Trade Certified',
  'Rainforest Alliance',
  'Non-GMO Project Verified',
  'Biodynamic',
  'Global GAP',
  'Local Organic',
  'Certified Humane',
  'Pasture Raised',
];

export const SUSTAINABILITY_PRACTICES = [
  'Water Conservation',
  'Soil Health Management',
  'Integrated Pest Management',
  'Renewable Energy Use',
  'Biodiversity Protection',
  'Carbon Sequestration',
  'Waste Reduction',
  'Crop Rotation',
  'Cover Cropping',
  'Composting',
];

export const PRODUCT_TYPES = [
  'Tomatoes',
  'Organic Tomatoes',
  'Carrots',
  'Organic Carrots',
  'Lettuce',
  'Organic Lettuce',
  'Apples',
  'Organic Apples',
  'Eggs',
  'Free-Range Eggs',
  'Milk',
  'Organic Milk',
  'Peppers',
  'Organic Peppers',
  'Onions',
  'Organic Onions',
];

export const QUALITY_THRESHOLDS = {
  EXCELLENT: 9.0,
  GOOD: 7.0,
  FAIR: 5.0,
  POOR: 0.0,
};

export const FAIRNESS_CRITERIA = [
  {
    id: 'labor_conditions',
    label: 'Labor Conditions',
    description: 'Working conditions, safety measures, and worker rights',
  },
  {
    id: 'wage_equity',
    label: 'Wage Equity',
    description: 'Fair compensation and wage equality',
  },
  {
    id: 'environmental_impact',
    label: 'Environmental Impact',
    description: 'Sustainable farming practices and environmental stewardship',
  },
  {
    id: 'community_benefit',
    label: 'Community Benefit',
    description: 'Positive impact on local communities and economies',
  },
];

export const NETWORK_CONFIG = {
  chainId: 1337, // Local development
  chainName: 'Localhost',
  rpcUrls: ['http://localhost:8545'],
  blockExplorerUrls: ['http://localhost:8545'],
};

export const CONTRACT_ADDRESSES = {
  AGRITRUST: process.env.REACT_APP_CONTRACT_ADDRESS || '',
};

export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  PRODUCERS: '/producers',
  BATCHES: '/batches',
  QUALITY: '/quality',
  FAIRNESS: '/fairness',
  PRICING: '/pricing',
  BLOCKCHAIN: '/blockchain',
  ANALYTICS: '/analytics',
};