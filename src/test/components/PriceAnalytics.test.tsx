import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PriceAnalytics } from '../../components/PriceAnalytics';

// Mock recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('PriceAnalytics', () => {
  it('renders price analytics dashboard', () => {
    renderWithQueryClient(<PriceAnalytics />);
    
    expect(screen.getByText('Price Analytics & Forecasting')).toBeInTheDocument();
    expect(screen.getByText('Current Price')).toBeInTheDocument();
    expect(screen.getByText('Trading Volume')).toBeInTheDocument();
    expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
  });

  it('displays price chart', () => {
    renderWithQueryClient(<PriceAnalytics />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Price History & Forecast')).toBeInTheDocument();
  });

  it('shows market insights', () => {
    renderWithQueryClient(<PriceAnalytics />);
    
    expect(screen.getByText('Market Insights')).toBeInTheDocument();
    expect(screen.getByText('Price Drivers')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  it('allows product type selection', () => {
    renderWithQueryClient(<PriceAnalytics />);
    
    const productSelect = screen.getByDisplayValue('Organic Tomatoes');
    expect(productSelect).toBeInTheDocument();
  });
});