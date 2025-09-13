import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Plus, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Upload,
  FileText,
  Calendar
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileUpload } from './FileUpload';
import { useToast } from './Toast';

const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuingBody: z.string().min(1, 'Issuing body is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  description: z.string().optional(),
});

type CertificationFormData = z.infer<typeof certificationSchema>;

interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired';
  description?: string;
  documentUrl?: string;
}

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'USDA Organic',
    issuingBody: 'United States Department of Agriculture',
    issueDate: '2023-01-15',
    expiryDate: '2025-01-15',
    status: 'active',
    description: 'Certified organic farming practices',
  },
  {
    id: '2',
    name: 'Fair Trade Certified',
    issuingBody: 'Fair Trade USA',
    issueDate: '2023-03-20',
    expiryDate: '2025-03-20',
    status: 'active',
    description: 'Fair labor and trade practices certification',
  },
  {
    id: '3',
    name: 'Rainforest Alliance',
    issuingBody: 'Rainforest Alliance',
    issueDate: '2023-06-10',
    expiryDate: '2024-06-10',
    status: 'pending',
    description: 'Sustainable agriculture and environmental protection',
  },
];

export const CertificationManager: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>(mockCertifications);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
  });

  const onSubmit = async (data: CertificationFormData) => {
    try {
      const newCertification: Certification = {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
      };

      setCertifications(prev => [...prev, newCertification]);
      
      showToast({
        type: 'success',
        title: 'Certification Added',
        message: 'Your certification has been submitted for verification.',
      });

      reset();
      setSelectedFile(null);
      setShowAddForm(false);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to Add Certification',
        message: 'An error occurred while adding the certification.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 
                           text-success-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-100 
                           text-warning-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 
                           text-error-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Certification Manager
            </h1>
            <p className="text-lg text-neutral-600">
              Manage your farm certifications and compliance documents
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                       rounded-lg font-medium transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Certification
          </motion.button>
        </motion.div>

        {/* Certifications List */}
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {cert.name}
                      </h3>
                      {getStatusBadge(cert.status)}
                      {isExpiringSoon(cert.expiryDate) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-100 
                                         text-warning-700 text-xs font-medium rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Expires Soon
                        </span>
                      )}
                    </div>
                    
                    <p className="text-neutral-600 mb-3">{cert.issuingBody}</p>
                    
                    {cert.description && (
                      <p className="text-sm text-neutral-700 mb-3">{cert.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500">Issue Date:</span>
                        <p className="font-medium text-neutral-900">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500">Expiry Date:</span>
                        <p className="font-medium text-neutral-900">
                          {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {cert.documentUrl && (
                    <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                                       hover:bg-neutral-100 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-neutral-400 hover:text-error-600 rounded-lg 
                                     hover:bg-error-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Certification Modal */}
        <AnimatePresence>
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neutral-900">
                    Add New Certification
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg 
                               hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Certification Name *
                      </label>
                      <input
                        {...register('name')}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                   transition-all duration-200"
                        placeholder="e.g., USDA Organic"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Issuing Body *
                      </label>
                      <input
                        {...register('issuingBody')}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                   transition-all duration-200"
                        placeholder="e.g., USDA"
                      />
                      {errors.issuingBody && (
                        <p className="mt-1 text-sm text-error-600">{errors.issuingBody.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Issue Date *
                      </label>
                      <input
                        {...register('issueDate')}
                        type="date"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                   transition-all duration-200"
                      />
                      {errors.issueDate && (
                        <p className="mt-1 text-sm text-error-600">{errors.issueDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        {...register('expiryDate')}
                        type="date"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                   transition-all duration-200"
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-error-600">{errors.expiryDate.message}</p>
                      )}
                    </div>
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
                      placeholder="Brief description of the certification..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Certification Document
                    </label>
                    <FileUpload
                      onFileSelect={setSelectedFile}
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxSize={5}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <motion.button
                      type="submit"
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white 
                                 rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Certification
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 border border-neutral-300 text-neutral-700 
                                 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};