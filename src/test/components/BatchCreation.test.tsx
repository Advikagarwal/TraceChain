import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchCreation } from '../../components/BatchCreation';
import { ToastProvider } from '../../components/Toast';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {component}
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('BatchCreation', () => {
  it('renders batch creation form', () => {
    renderWithProviders(<BatchCreation producerId="test-producer" />);
    
    expect(screen.getByText('Create New Batch')).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Harvest Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<BatchCreation producerId="test-producer" />);
    
    const submitButton = screen.getByText('Create Batch');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Product type is required')).toBeInTheDocument();
      expect(screen.getByText('Quantity must be greater than 0')).toBeInTheDocument();
      expect(screen.getByText('Harvest date is required')).toBeInTheDocument();
    });
  });

  it('allows certification selection', () => {
    renderWithProviders(<BatchCreation producerId="test-producer" />);
    
    const organicButton = screen.getByText('USDA Organic');
    fireEvent.click(organicButton);
    
    expect(organicButton).toHaveClass('border-accent-500');
  });

  it('handles form submission', async () => {
    renderWithProviders(<BatchCreation producerId="test-producer" />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Product Type/), {
      target: { value: 'Organic Tomatoes' }
    });
    fireEvent.change(screen.getByLabelText(/Quantity/), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText(/Harvest Date/), {
      target: { value: '2024-01-15' }
    });
    fireEvent.change(screen.getByLabelText(/Location/), {
      target: { value: 'Green Valley Farm, California' }
    });

    const submitButton = screen.getByText('Create Batch');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Creating Batch...');
    });
  });
});