import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Producers
export const useProducers = () => {
  return useQuery({
    queryKey: ['producers'],
    queryFn: () => apiService.producers.getAll(),
  });
};

export const useProducer = (id: string) => {
  return useQuery({
    queryKey: ['producer', id],
    queryFn: () => apiService.producers.getById(id),
    enabled: !!id,
  });
};

export const useCreateProducer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.producers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producers'] });
    },
  });
};

// Batches
export const useBatches = (filters?: any) => {
  return useQuery({
    queryKey: ['batches', filters],
    queryFn: () => apiService.batches.getAll(),
  });
};

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => apiService.batches.getById(id),
    enabled: !!id,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.batches.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

// Quality Assessment
export const useQualityAssessment = (batchId: string) => {
  return useQuery({
    queryKey: ['quality', batchId],
    queryFn: () => apiService.quality.getByBatch(batchId),
    enabled: !!batchId,
  });
};

export const useCreateQualityAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ batchId, imageFile }: { batchId: string; imageFile: File }) =>
      apiService.quality.assess(batchId, imageFile),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quality', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
    },
  });
};

// Analytics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiService.analytics.getDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useProducerStats = (producerId: string) => {
  return useQuery({
    queryKey: ['producer-stats', producerId],
    queryFn: () => apiService.analytics.getProducerStats(producerId),
    enabled: !!producerId,
  });
};

export const useMarketTrends = () => {
  return useQuery({
    queryKey: ['market-trends'],
    queryFn: () => apiService.analytics.getMarketTrends(),
    refetchInterval: 60000, // Refetch every minute
  });
};

// Pricing
export const useCurrentPrice = (productType: string) => {
  return useQuery({
    queryKey: ['price', productType],
    queryFn: () => apiService.pricing.getCurrent(productType),
    enabled: !!productType,
    refetchInterval: 30000,
  });
};

export const usePriceForecast = (productType: string, days: number = 30) => {
  return useQuery({
    queryKey: ['price-forecast', productType, days],
    queryFn: () => apiService.pricing.getForecast(productType, days),
    enabled: !!productType,
  });
};

// Blockchain
export const useMintNFT = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.blockchain.mintNFT,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useTokenInfo = (tokenId: number) => {
  return useQuery({
    queryKey: ['token', tokenId],
    queryFn: () => apiService.blockchain.getTokenInfo(tokenId),
    enabled: !!tokenId,
  });
};