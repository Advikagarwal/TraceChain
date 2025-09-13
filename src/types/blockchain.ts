export interface Producer {
  id: string;
  walletAddress: string;
  name: string;
  location: string;
  certifications: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  fairnessScore: number;
  qualityScore: number;
  totalBatches: number;
  joinedDate: string;
  avatar?: string;
  description?: string;
  farmSize?: number;
  sustainabilityPractices?: string[];
}

export interface Batch {
  id: string;
  tokenId: number;
  producerId: string;
  productType: string;
  quantity: number;
  harvestDate: string;
  location: string;
  qualityScore: number;
  fairnessScore: number;
  certifications: string[];
  currentStage: 'harvested' | 'processed' | 'packaged' | 'shipped' | 'delivered';
  supplyChain: SupplyChainEvent[];
  price?: number;
  imageUrl?: string;
  description?: string;
}

export interface SupplyChainEvent {
  id: string;
  batchId: string;
  stage: string;
  timestamp: string;
  location: string;
  actor: string;
  description: string;
  verified: boolean;
  transactionHash?: string;
}

export interface QualityAssessment {
  id: string;
  batchId: string;
  overallScore: number;
  freshness: number;
  appearance: number;
  size: number;
  defects: number;
  assessmentDate: string;
  aiConfidence: number;
  imageAnalysis: {
    detectedIssues: string[];
    recommendations: string[];
  };
}

export interface FairnessAssessment {
  id: string;
  producerId: string;
  laborConditions: number;
  wageEquity: number;
  environmentalImpact: number;
  communityBenefit: number;
  overallScore: number;
  assessmentDate: string;
  verificationMethod: string;
  recommendations: string[];
}

export interface PriceData {
  productType: string;
  currentPrice: number;
  priceHistory: {
    date: string;
    price: number;
  }[];
  forecast: {
    date: string;
    predictedPrice: number;
    confidence: number;
  }[];
  marketTrends: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    factors: string[];
  };
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}