import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface UseSocketOptions {
  onBatchUpdate?: (data: any) => void;
  onQualityAssessment?: (data: any) => void;
  onProducerVerification?: (data: any) => void;
  onNotification?: (data: any) => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket server
    const socket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:8000', {
      auth: {
        userId: user.id,
      },
    });

    socketRef.current = socket;

    // Set up event listeners
    if (options.onBatchUpdate) {
      socket.on('batch_updated', options.onBatchUpdate);
    }

    if (options.onQualityAssessment) {
      socket.on('quality_assessed', options.onQualityAssessment);
    }

    if (options.onProducerVerification) {
      socket.on('producer_verified', options.onProducerVerification);
    }

    if (options.onNotification) {
      socket.on('notification', options.onNotification);
    }

    // Handle connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, [user, options]);

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return { emit };
};