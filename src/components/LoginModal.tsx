import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['producer', 'consumer', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { signIn, signUp } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'consumer',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      await signIn(data.email, data.password);
      setMessage({ type: 'success', text: 'Successfully logged in!' });
      setTimeout(() => {
        onClose();
        loginForm.reset();
      }, 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      await signUp(data.email, data.password, data.role);
      setMessage({ type: 'success', text: 'Account created! Please check your email to verify.' });
      setTimeout(() => {
        setIsSignup(false);
        signupForm.reset();
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setMessage(null);
    loginForm.reset();
    signupForm.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            {isSignup ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                       hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-success-50 text-success-700 border border-success-200'
                  : 'bg-error-50 text-error-700 border border-error-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSignup ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...loginForm.register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...loginForm.register('password')}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white 
                         rounded-lg font-medium transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...signupForm.register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {signupForm.formState.errors.email && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Role
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <select
                  {...signupForm.register('role')}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200 bg-white"
                >
                  <option value="consumer">Consumer</option>
                  <option value="producer">Producer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...signupForm.register('password')}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>
              {signupForm.formState.errors.password && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...signupForm.register('confirmPassword')}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
              {signupForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white 
                         rounded-lg font-medium transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isSignup 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </motion.div>
    </div>
  );
};