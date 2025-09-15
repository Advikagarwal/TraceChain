import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Package, BarChart3, Users, Settings } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  user?: any;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  user
}) => {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tracker', label: 'Track Supply Chain', icon: Package },
    { id: 'marketplace', label: 'Marketplace', icon: BarChart3 },
    { id: 'register', label: 'Register Producer', icon: Users },
    ...(user?.user_metadata?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : []),
  ];

  const handleNavigation = (viewId: string) => {
    onViewChange(viewId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 md:hidden"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 
                                  rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-neutral-900">TraceChain</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                             hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-6">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                                 font-medium transition-all duration-200 ${
                                   currentView === item.id
                                     ? 'bg-primary-100 text-primary-700'
                                     : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                                 }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {user && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{user.email}</p>
                    <p className="text-sm text-neutral-500 capitalize">
                      {user.user_metadata?.role || 'User'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};