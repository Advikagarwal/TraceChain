import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2, Copy } from 'lucide-react';
import { useToast } from './Toast';

interface QRCodeGeneratorProps {
  batchId: string;
  productName: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  batchId, 
  productName 
}) => {
  const [qrSize, setQrSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

  // Generate QR code data URL (in production, use a QR code library)
  const generateQRCode = () => {
    const trackingUrl = `${window.location.origin}/track/${batchId}`;
    
    // Simulate QR code generation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple placeholder pattern (use actual QR library in production)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < qrSize; i += 20) {
      for (let j = 0; j < qrSize; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i + 2, j + 2, 16, 16);
        }
      }
    }

    return trackingUrl;
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `tracechain-qr-${batchId}.png`;
    link.href = canvas.toDataURL();
    link.click();

    showToast({
      type: 'success',
      title: 'QR Code Downloaded',
      message: 'QR code has been saved to your device.',
    });
  };

  const copyTrackingUrl = () => {
    const url = generateQRCode();
    if (url) {
      navigator.clipboard.writeText(url);
      showToast({
        type: 'success',
        title: 'URL Copied',
        message: 'Tracking URL copied to clipboard.',
      });
    }
  };

  const shareQRCode = async () => {
    const url = generateQRCode();
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track ${productName} - AgriTrust`,
          text: `Track this ${productName} batch through the supply chain`,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyTrackingUrl();
    }
  };

  React.useEffect(() => {
    generateQRCode();
  }, [qrSize, batchId]);

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            QR Code Generator
          </h3>
          <p className="text-sm text-neutral-600">
            Generate QR code for batch tracking
          </p>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white border-2 border-neutral-200 rounded-lg">
            <canvas
              ref={canvasRef}
              width={qrSize}
              height={qrSize}
              className="block"
              style={{ width: '200px', height: '200px' }}
            />
          </div>
        </div>

        {/* Batch Info */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-neutral-600">Batch ID</p>
            <p className="font-mono font-medium text-neutral-900">{batchId}</p>
            <p className="text-sm text-neutral-600 mt-2">Product</p>
            <p className="font-medium text-neutral-900">{productName}</p>
          </div>
        </div>

        {/* Size Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            QR Code Size
          </label>
          <select
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg 
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={128}>Small (128px)</option>
            <option value={256}>Medium (256px)</option>
            <option value={512}>Large (512px)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            onClick={downloadQRCode}
            className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                       rounded-lg font-medium transition-colors flex items-center 
                       justify-center gap-1 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>

          <motion.button
            onClick={shareQRCode}
            className="px-3 py-2 bg-secondary-600 hover:bg-secondary-700 text-white 
                       rounded-lg font-medium transition-colors flex items-center 
                       justify-center gap-1 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>

          <motion.button
            onClick={copyTrackingUrl}
            className="px-3 py-2 border border-neutral-300 text-neutral-700 
                       rounded-lg font-medium hover:bg-neutral-50 transition-colors 
                       flex items-center justify-center gap-1 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Copy className="w-4 h-4" />
            Copy URL
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};