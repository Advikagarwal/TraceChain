import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle,
  Lock
} from 'lucide-react';
import { useToast } from './Toast';

interface PaymentIntegrationProps {
  productId: string;
  productName: string;
  price: number;
  onPaymentSuccess?: (paymentId: string) => void;
}

export const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  productId,
  productName,
  price,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { showToast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const paymentId = `pay_${Date.now()}`;
      setPaymentComplete(true);
      
      showToast({
        type: 'success',
        title: 'Payment Successful',
        message: `Your purchase of ${productName} has been completed.`
      });
      
      onPaymentSuccess?.(paymentId);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Payment Failed',
        message: 'There was an issue processing your payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 text-center"
      >
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">Payment Successful!</h3>
        <p className="text-neutral-600 mb-4">
          Thank you for your purchase of {productName}. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={() => setPaymentComplete(false)}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                     rounded-lg font-medium transition-colors"
        >
          Continue Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            Secure Payment
          </h3>
          <p className="text-sm text-neutral-600">
            Complete your purchase securely
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-neutral-900 mb-3">Order Summary</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">{productName}</span>
            <span className="font-medium text-neutral-900">${price.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Processing Fee</span>
            <span className="font-medium text-neutral-900">$2.50</span>
          </div>
          <div className="border-t border-neutral-200 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">Total</span>
              <span className="font-bold text-primary-600">${(price + 2.50).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <Lock className="w-4 h-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Payment Button */}
        <motion.button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white 
                     rounded-lg font-semibold transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4" />
              Pay ${(price + 2.50).toFixed(2)}
            </>
          )}
        </motion.button>

        <p className="text-xs text-neutral-500 text-center mt-4">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};