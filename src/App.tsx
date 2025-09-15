import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginModal } from './components/LoginModal';
import { NotificationCenter } from './components/NotificationCenter';
import { AdminPanel } from './components/AdminPanel';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SupplyChainTracker } from './components/SupplyChainTracker';
import { ProducerRegistration } from './components/ProducerRegistration';
import { MarketPlace } from './components/MarketPlace';
import { ProducerProfile } from './components/ProducerProfile';
import { BatchCreation } from './components/BatchCreation';
import { PriceAnalytics } from './components/PriceAnalytics';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { SupplyChainMap } from './components/SupplyChainMap';
import { SmartContractInterface } from './components/SmartContractInterface';
import { CertificationManager } from './components/CertificationManager';
import { ProductCatalog } from './components/ProductCatalog';
import { LoadingScreen } from './components/LoadingScreen';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const [currentView, setCurrentView] = useState('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, loading } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'tracker':
        return <SupplyChainTracker />;
      case 'register':
        return <ProducerRegistration />;
      case 'marketplace':
        return <ProductCatalog />;
      case 'profile':
        return <ProducerProfile />;
      case 'create-batch':
        return <BatchCreation producerId="mock-producer-id" />;
      case 'price-analytics':
        return <PriceAnalytics />;
      case 'advanced-analytics':
        return <AdvancedAnalytics />;
      case 'supply-map':
        return <SupplyChainMap />;
      case 'smart-contract':
        return <SmartContractInterface batchId="mock-batch-id" />;
      case 'certifications':
        return <CertificationManager />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView('dashboard')} />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {currentView !== 'landing' && (
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onLoginClick={() => setShowLoginModal(true)}
          user={user}
        />
      )}
      <main>
        {renderCurrentView()}
      </main>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;