import React from 'react';
import { Leaf, Menu, X, LogIn, User } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { NotificationCenter } from './NotificationCenter';
import { MobileMenu } from './MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLoginClick?: () => void;
  user?: any;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  onLoginClick,
  user 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { signOut } = useAuth();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tracker', label: 'Track Supply Chain' },
    { id: 'supply-map', label: 'Supply Map' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'price-analytics', label: 'Price Analytics' },
    { id: 'register', label: 'Register Producer' },
    { id: 'create-batch', label: 'Create Batch' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'smart-contract', label: 'Smart Contract' },
    { id: 'advanced-analytics', label: 'Advanced Analytics' },
    ...(user?.user_metadata?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel' }] : []),
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onViewChange('landing')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 
                            rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">TraceChain</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Desktop Wallet Connect */}
          <div className="hidden md:flex items-center gap-4">
            {user && <NotificationCenter />}
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                  <User className="w-4 h-4 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 
                             hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 
                           hover:bg-primary-700 text-white rounded-lg font-medium 
                           transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
            
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-600" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentView={currentView}
        onViewChange={onViewChange}
        user={user}
      />
    </header>
  );
};