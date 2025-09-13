export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num / 100);
};

export const truncateAddress = (address: string, chars: number = 6): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatWeight = (weight: number, unit: string = 'kg'): string => {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(1)} t`;
  }
  return `${weight} ${unit}`;
};

export const getStageColor = (stage: string): string => {
  const stageColors: Record<string, string> = {
    harvested: 'bg-accent-100 text-accent-800',
    processed: 'bg-secondary-100 text-secondary-800',
    packaged: 'bg-primary-100 text-primary-800',
    shipped: 'bg-warning-100 text-warning-800',
    delivered: 'bg-success-100 text-success-800',
  };
  
  return stageColors[stage] || 'bg-neutral-100 text-neutral-800';
};

export const getScoreColor = (score: number): string => {
  if (score >= 9) return 'text-success-600';
  if (score >= 7) return 'text-accent-600';
  if (score >= 5) return 'text-warning-600';
  return 'text-error-600';
};

export const getScoreBadgeColor = (score: number): string => {
  if (score >= 9) return 'bg-success-100 text-success-800';
  if (score >= 7) return 'bg-accent-100 text-accent-800';
  if (score >= 5) return 'bg-warning-100 text-warning-800';
  return 'bg-error-100 text-error-800';
};