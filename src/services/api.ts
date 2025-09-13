import axios from 'axios';
import { Producer, Batch, QualityAssessment, FairnessAssessment, PriceData } from '../types/blockchain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Producer endpoints
  producers: {
    getAll: () => api.get<Producer[]>('/producers'),
    getById: (id: string) => api.get<Producer>(`/producers/${id}`),
    create: (data: Omit<Producer, 'id'>) => api.post<Producer>('/producers', data),
    update: (id: string, data: Partial<Producer>) => api.put<Producer>(`/producers/${id}`, data),
    verify: (id: string) => api.post(`/producers/${id}/verify`),
  },

  // Batch endpoints
  batches: {
    getAll: () => api.get<Batch[]>('/batches'),
    getById: (id: string) => api.get<Batch>(`/batches/${id}`),
    getByTokenId: (tokenId: number) => api.get<Batch>(`/batches/token/${tokenId}`),
    create: (data: Omit<Batch, 'id'>) => api.post<Batch>('/batches', data),
    update: (id: string, data: Partial<Batch>) => api.put<Batch>(`/batches/${id}`, data),
    updateStage: (id: string, stage: string, location: string, description: string) =>
      api.post(`/batches/${id}/stage`, { stage, location, description }),
  },

  // Quality assessment endpoints
  quality: {
    assess: (batchId: string, imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      return api.post<QualityAssessment>(`/quality/assess/${batchId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    getByBatch: (batchId: string) => api.get<QualityAssessment>(`/quality/batch/${batchId}`),
  },

  // Fairness assessment endpoints
  fairness: {
    assess: (producerId: string, data: any) => 
      api.post<FairnessAssessment>(`/fairness/assess/${producerId}`, data),
    getByProducer: (producerId: string) => api.get<FairnessAssessment>(`/fairness/producer/${producerId}`),
  },

  // Pricing endpoints
  pricing: {
    getCurrent: (productType: string) => api.get<PriceData>(`/pricing/${productType}`),
    getForecast: (productType: string, days: number) => 
      api.get<PriceData>(`/pricing/${productType}/forecast?days=${days}`),
    getHistory: (productType: string, period: string) => 
      api.get<PriceData>(`/pricing/${productType}/history?period=${period}`),
  },

  // Blockchain endpoints
  blockchain: {
    mintNFT: (batchData: any) => api.post('/blockchain/mint', batchData),
    getTokenInfo: (tokenId: number) => api.get(`/blockchain/token/${tokenId}`),
    verifyTransaction: (txHash: string) => api.get(`/blockchain/verify/${txHash}`),
  },

  // Analytics endpoints
  analytics: {
    getDashboardStats: () => api.get('/analytics/dashboard'),
    getProducerStats: (producerId: string) => api.get(`/analytics/producer/${producerId}`),
    getMarketTrends: () => api.get('/analytics/market-trends'),
  },
};

export default apiService;