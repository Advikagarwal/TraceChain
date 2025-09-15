import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const walletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address');

// Producer validation
export const producerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  location: z.string().min(5, 'Please provide a detailed location').max(200, 'Location too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description too long'),
  farmSize: z.number().min(0.1, 'Farm size must be greater than 0'),
  certifications: z.array(z.string()).min(1, 'At least one certification is required'),
  sustainabilityPractices: z.array(z.string()).min(1, 'At least one practice is required'),
  walletAddress: walletAddressSchema.optional(),
});

// Batch validation
export const batchSchema = z.object({
  productType: z.string().min(1, 'Product type is required'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  harvestDate: z.string().min(1, 'Harvest date is required'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  description: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

// Authentication validation
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['producer', 'consumer', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Utility functions
export const validateBatchId = (batchId: string): boolean => {
  return /^[A-Z]\d{3,}$/.test(batchId);
};

export const validateTokenId = (tokenId: string): boolean => {
  return /^\d+$/.test(tokenId) && parseInt(tokenId) > 0;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};