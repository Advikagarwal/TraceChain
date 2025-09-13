import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Leaf,
  Award
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useCreateBatch } from '../hooks/useApi';
import { useToast } from './Toast';
import { PRODUCT_TYPES, CERTIFICATION_OPTIONS } from '../constants';

const batchSchema = z.object({
  productType: z.string().min(1, 'Product type is required'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  harvestDate: z.string().min(1, 'Harvest date is required'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  description: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

interface BatchCreationProps {
  producerId: string;
  onSuccess?: () => void;
}

export const BatchCreation: React.FC<BatchCreationProps> = ({ 
  producerId, 
  onSuccess 
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const createBatch = useCreateBatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      certifications: [],
    },
  });

  const watchedCertifications = watch('certifications') || [];

  const toggleCertification = (cert: string) => {
    const current = watchedCertifications;
    const updated = current.includes(cert)
      ? current.filter(c => c !== cert)
      : [...current, cert];
    setValue('certifications', updated);
  };

  const onSubmit = async (data: BatchFormData) => {
    setIsSubmitting(true);
    
    try {
      const batchData = {
        ...data,
        producerId,
        harvestDate: new Date(data.harvestDate).toISOString(),
        imageFile: selectedImage,
      };

      await createBatch.mutateAsync(batchData);
      
      showToast({
        type: 'success',
        title: 'Batch Created Successfully',
        message: 'Your batch has been registered and is ready for quality assessment.',
      });

      reset();
      setSelectedImage(null);
      onSuccess?.();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Failed to Create Batch',
        message: error.message || 'An error occurred while creating the batch.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Create New Batch
          </h2>
          <p className="text-neutral-600">
            Register a new produce batch for supply chain tracking
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-500" />
              Product Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Product Type *
                </label>
                <select
                  {...register('productType')}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                >
                  <option value="">Select product type</option>
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.productType && (
                  <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.productType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quantity (kg) *
                </label>
                <input
                  {...register('quantity', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Enter quantity in kg"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Harvest Date *
              </label>
              <input
                {...register('harvestDate')}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
              />
              {errors.harvestDate && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.harvestDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register('location')}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Farm location (e.g., Green Valley Farm, California)"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200 resize-none"
                placeholder="Additional details about this batch..."
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-500" />
              Certifications
            </h3>
            <p className="text-sm text-neutral-600">
              Select applicable certifications for this batch
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CERTIFICATION_OPTIONS.map((cert) => (
                <motion.button
                  key={cert}
                  type="button"
                  onClick={() => toggleCertification(cert)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    watchedCertifications.includes(cert)
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cert}</span>
                    {watchedCertifications.includes(cert) && (
                      <CheckCircle className="w-5 h-5 text-accent-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-secondary-500" />
              Product Image
            </h3>
            <p className="text-sm text-neutral-600">
              Upload an image for AI quality assessment
            </p>

            <FileUpload
              onFileSelect={setSelectedImage}
              accept="image/*"
              maxSize={10}
            />

            {selectedImage && (
              <div className="flex items-center gap-3 p-3 bg-success-50 rounded-lg border border-success-200">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <div>
                  <p className="text-sm font-medium text-success-700">
                    Image selected: {selectedImage.name}
                  </p>
                  <p className="text-xs text-success-600">
                    Ready for AI quality assessment
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white 
                       rounded-lg font-semibold transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Creating Batch...' : 'Create Batch'}
          </motion.button>

          <p className="text-xs text-neutral-500 text-center">
            By creating this batch, you confirm that all information is accurate and 
            the produce meets the specified quality and certification standards.
          </p>
        </form>
      </motion.div>
    </div>
  );
};