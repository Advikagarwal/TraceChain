// Custom error classes
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class BlockchainError extends Error {
  constructor(
    message: string,
    public txHash?: string
  ) {
    super(message);
    this.name = 'BlockchainError';
  }
}

// Error handling utilities
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const handleBlockchainError = (error: any): string => {
  if (error.code === 4001) {
    return 'Transaction was rejected by user';
  }
  if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  }
  if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  return error.message || 'Blockchain transaction failed';
};

export const isNetworkError = (error: any): boolean => {
  return error.code === 'NETWORK_ERROR' || 
         error.message?.includes('Network Error') ||
         error.message?.includes('fetch');
};