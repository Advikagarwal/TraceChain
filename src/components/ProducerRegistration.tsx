import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Leaf,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const producerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(5, 'Please provide a detailed location'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  farmSize: z.number().min(0.1, 'Farm size must be greater than 0'),
  certifications: z.array(z.string()).min(1, 'At least one certification is required'),
  sustainabilityPractices: z.array(z.string()).min(1, 'At least one practice is required'),
});

type ProducerFormData = z.infer<typeof producerSchema>;

const certificationOptions = [
  'USDA Organic',
  'Fair Trade Certified',
  'Rainforest Alliance',
  'Non-GMO Project Verified',
  'Biodynamic',
  'Global GAP',
  'Local Organic',
];

const sustainabilityOptions = [
  'Water Conservation',
  'Soil Health Management',
  'Integrated Pest Management',
  'Renewable Energy Use',
  'Biodiversity Protection',
  'Carbon Sequestration',
  'Waste Reduction',
  'Crop Rotation',
];

export const ProducerRegistration: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProducerFormData>({
    resolver: zodResolver(producerSchema),
    defaultValues: {
      certifications: [],
      sustainabilityPractices: [],
    },
  });

  const watchedCertifications = watch('certifications') || [];
  const watchedPractices = watch('sustainabilityPractices') || [];

  const toggleCertification = (cert: string) => {
    const current = watchedCertifications;
    const updated = current.includes(cert)
      ? current.filter(c => c !== cert)
      : [...current, cert];
    setValue('certifications', updated);
  };

  const togglePractice = (practice: string) => {
    const current = watchedPractices;
    const updated = current.includes(practice)
      ? current.filter(p => p !== practice)
      : [...current, practice];
    setValue('sustainabilityPractices', updated);
  };

  const onSubmit = async (data: ProducerFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Producer registration data:', data);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-neutral-200 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Registration Submitted!</h2>
          <p className="text-neutral-600 mb-6">
            Your producer registration has been submitted for review. You'll receive a notification 
            once the verification process is complete.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white 
                       rounded-lg font-medium transition-colors duration-200"
          >
            Register Another Producer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Producer Registration
          </h1>
          <p className="text-lg text-neutral-600">
            Join the TraceChain network and showcase your commitment to quality and fairness
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Farm/Producer Name *
              </label>
              <input
                {...register('name')}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
                placeholder="Enter your farm or business name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location *
              </label>
              <input
                {...register('location')}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
                placeholder="City, State, Country"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Farm Size (acres) *
              </label>
              <input
                {...register('farmSize', { valueAsNumber: true })}
                type="number"
                step="0.1"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
                placeholder="Enter farm size in acres"
              />
              {errors.farmSize && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.farmSize.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200 resize-none"
                placeholder="Describe your farm, growing practices, and mission..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-500" />
              Certifications *
            </h3>
            <p className="text-sm text-neutral-600">
              Select all certifications that apply to your farm
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificationOptions.map((cert) => (
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
            {errors.certifications && (
              <p className="text-sm text-error-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.certifications.message}
              </p>
            )}
          </div>

          {/* Sustainability Practices */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success-500" />
              Sustainability Practices *
            </h3>
            <p className="text-sm text-neutral-600">
              Select the sustainable practices you implement on your farm
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sustainabilityOptions.map((practice) => (
                <motion.button
                  key={practice}
                  type="button"
                  onClick={() => togglePractice(practice)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    watchedPractices.includes(practice)
                      ? 'border-success-500 bg-success-50 text-success-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{practice}</span>
                    {watchedPractices.includes(practice) && (
                      <CheckCircle className="w-5 h-5 text-success-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            {errors.sustainabilityPractices && (
              <p className="text-sm text-error-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.sustainabilityPractices.message}
              </p>
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
            {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
          </motion.button>

          <p className="text-xs text-neutral-500 text-center">
            By registering, you agree to our verification process and commit to maintaining 
            the highest standards of quality and fairness in your agricultural practices.
          </p>
        </motion.form>
      </div>
    </div>
  );
};