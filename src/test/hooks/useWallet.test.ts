import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWallet } from '../../hooks/useWallet';

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn(() => ({
      listAccounts: vi.fn(() => Promise.resolve(['0x123'])),
      getSigner: vi.fn(() => Promise.resolve({
        getAddress: vi.fn(() => Promise.resolve('0x1234567890123456789012345678901234567890')),
      })),
      getBalance: vi.fn(() => Promise.resolve('1000000000000000000')),
      getNetwork: vi.fn(() => Promise.resolve({ chainId: 1n })),
    })),
    formatEther: vi.fn(() => '1.0'),
  },
}));

describe('useWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useWallet());
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBe(null);
    expect(result.current.balance).toBe(null);
  });

  it('should handle wallet connection', async () => {
    // Mock successful connection
    window.ethereum = {
      request: vi.fn(() => Promise.resolve(['0x123'])),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectWallet();
    });

    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    });
  });

  it('should handle missing MetaMask', async () => {
    // Remove ethereum object
    delete (window as any).ethereum;

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectWallet();
    });

    expect(result.current.error).toContain('MetaMask is not installed');
  });

  it('should disconnect wallet', () => {
    const { result } = renderHook(() => useWallet());

    act(() => {
      result.current.disconnectWallet();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBe(null);
    expect(result.current.balance).toBe(null);
  });
});