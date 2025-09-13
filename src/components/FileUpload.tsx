import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 10,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('Invalid file type. Please select an image file.');
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, maxSize, accept]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className={className}>
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : error
            ? 'border-error-300 bg-error-50'
            : 'border-neutral-300 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
      >
        <FileImage className={`w-12 h-12 mx-auto mb-4 ${
          error ? 'text-error-400' : 'text-neutral-400'
        }`} />
        
        <p className={`text-lg font-medium mb-2 ${
          error ? 'text-error-700' : 'text-neutral-900'
        }`}>
          {error ? 'Upload Error' : 'Upload File'}
        </p>
        
        {error ? (
          <div className="flex items-center justify-center gap-2 text-error-600 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          <p className="text-neutral-600 mb-4">
            Drag and drop a file here, or click to select
          </p>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                     cursor-pointer transition-colors ${
                       error
                         ? 'bg-error-600 hover:bg-error-700 text-white'
                         : 'bg-primary-600 hover:bg-primary-700 text-white'
                     }`}
        >
          <Upload className="w-4 h-4" />
          {error ? 'Try Again' : 'Select File'}
        </label>

        <p className="text-xs text-neutral-500 mt-2">
          Maximum file size: {maxSize}MB
        </p>
      </motion.div>
    </div>
  );
};