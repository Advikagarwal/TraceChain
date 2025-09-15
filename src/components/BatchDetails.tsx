import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Award, 
  Leaf,
  ExternalLink,
  Share2,
  Download,
  Camera,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QualityAssessment } from './QualityAssessment';

interface BatchDetailsProps {
  batchId: string;
  onClose: () => void;
}

export const BatchDetails: React.FC<BatchDetailsProps> = ({ batchId, onClose }) => {
  const [batch, setBatch] = useState<any>(null);
  const [producer, setProducer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQualityAssessment, setShowQualityAssessment] = useState(false);

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch batch details
      const batchResponse = await fetch(`/api/v1/batches/${batchId}`);
      const batchData = await batchResponse.json();
      setBatch(batchData);
      
      // Fetch producer details
      const producerResponse = await fetch(`/api/v1/producers/${batchData.producer_id}`);
      const producerData = await producerResponse.json();
      setProducer(producerData);
      
    } catch (error) {
      console.error('Failed to fetch batch details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQualityAssessment = (assessment: any) => {
    setBatch(prev => ({
      ...prev,
      quality_score: assessment.overall_score
    }));
    setShowQualityAssessment(false);
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${batch.product_type} - AgriTrust`,
          text: `Check out this verified ${batch.product_type} from ${producer?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-neutral-600">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Batch Not Found</h3>
          <p className="text-neutral-600 mb-4">The requested batch could not be found.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{batch.product_type}</h2>
              <p className="text-neutral-600">Batch ID: {batch.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareProduct}
                className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                           hover:bg-neutral-100 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                           hover:bg-neutral-100 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Product Image and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {batch.image_url ? (
                <img
                  src={batch.image_url}
                  alt={batch.product_type}
                  className="w-full h-64 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-64 bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Package className="w-16 h-16 text-neutral-400" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-600">Producer:</span>
                    <span className="font-medium text-neutral-900">{producer?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-600">Quantity:</span>
                    <span className="font-medium text-neutral-900">{batch.quantity} kg</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-600">Harvest Date:</span>
                    <span className="font-medium text-neutral-900">
                      {new Date(batch.harvest_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-600">Location:</span>
                    <span className="font-medium text-neutral-900">{batch.location}</span>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-success-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success-700">
                    {batch.quality_score || 'N/A'}
                  </div>
                  <p className="text-sm text-success-600">Quality Score</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-700">
                    {batch.fairness_score || 'N/A'}
                  </div>
                  <p className="text-sm text-primary-600">Fairness Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {batch.description && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Description</h3>
              <p className="text-neutral-700">{batch.description}</p>
            </div>
          )}

          {/* Certifications */}
          {batch.certifications && batch.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-500" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {batch.certifications.map((cert: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quality Assessment Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Quality Assessment</h3>
              {!showQualityAssessment && (
                <button
                  onClick={() => setShowQualityAssessment(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg 
                             hover:bg-primary-700 transition-colors"
                >
                  New Assessment
                </button>
              )}
            </div>

            {showQualityAssessment ? (
              <QualityAssessment
                batchId={batchId}
                onAssessmentComplete={handleQualityAssessment}
              />
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <Camera className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                <p>No quality assessment available</p>
                <p className="text-sm">Upload an image to analyze quality</p>
              </div>
            )}
          </div>

          {/* Blockchain Info */}
          {batch.token_id && (
            <div className="bg-neutral-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Blockchain Verification</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">NFT Token ID:</span>
                  <span className="font-medium text-neutral-900">#{batch.token_id}</span>
                </div>
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
                  <ExternalLink className="w-4 h-4" />
                  View on Blockchain Explorer
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};