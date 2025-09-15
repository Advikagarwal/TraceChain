// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  NETWORK_ID: parseInt(import.meta.env.VITE_NETWORK_ID || '1337'),
  BLOCK_CONFIRMATIONS: 3,
  GAS_LIMIT: 500000,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 20,
};

// Quality Score Thresholds
export const QUALITY_LEVELS = {
  EXCELLENT: { min: 9.0, color: 'success', label: 'Excellent' },
  GOOD: { min: 7.0, color: 'primary', label: 'Good' },
  FAIR: { min: 5.0, color: 'warning', label: 'Fair' },
  POOR: { min: 0.0, color: 'error', label: 'Poor' },
};

// Supply Chain Stages
export const SUPPLY_CHAIN_STAGES = {
  HARVESTED: { id: 'harvested', label: 'Harvested', color: 'accent' },
  PROCESSED: { id: 'processed', label: 'Processed', color: 'secondary' },
  PACKAGED: { id: 'packaged', label: 'Packaged', color: 'primary' },
  SHIPPED: { id: 'shipped', label: 'Shipped', color: 'warning' },
  DELIVERED: { id: 'delivered', label: 'Delivered', color: 'success' },
};