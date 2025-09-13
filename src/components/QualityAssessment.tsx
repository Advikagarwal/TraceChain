import React, { useState } from 'react';
import { Upload, Camera, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface QualityAssessmentProps {
  batchId: string;
  onAssessmentComplete?: (assessment: any) => void;
}

export const QualityAssessment: React.FC<QualityAssessmentProps> = ({
  batchId,
  onAssessmentComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setAssessment(null);
    } else {
      alert('Please select an image file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const analyzeQuality = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis with realistic results
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAssessment = {
        overall_score: 8.5 + Math.random() * 1.5,
        freshness: 8.0 + Math.random() * 2.0,
        appearance: 8.2 + Math.random() * 1.8,
        size: 8.1 + Math.random() * 1.9,
        defects: 8.3 + Math.random() * 1.7,
        ai_confidence: 0.85 + Math.random() * 0.15,
        image_analysis: {
          detected_issues: [
            'Minor surface blemishes detected',
            'Slight color variation in some areas'
          ],
          recommendations: [
            'Store in cool, dry conditions',
            'Handle with care during transport',
            'Maintain optimal humidity levels'
          ]
        }
      };

      setAssessment(mockAssessment);
      onAssessmentComplete?.(mockAssessment);
    } catch (error) {
      console.error('Quality assessment failed:', error);
      alert('Assessment failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ScoreBar: React.FC<{ label: string; score: number; color: string }> = ({ 
    label, 
    score, 
    color 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-bold text-neutral-900">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary-500" />
        AI Quality Assessment
      </h3>

      {!selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-neutral-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-neutral-900 mb-2">
            Upload Product Image
          </p>
          <p className="text-neutral-600 mb-4">
            Drag and drop an image here, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white 
                       rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Select Image
          </label>
        </motion.div>
      )}

      {selectedFile && !assessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected product"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{selectedFile.name}</p>
              <p className="text-sm text-neutral-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              ×
            </button>
          </div>

          <motion.button
            onClick={analyzeQuality}
            disabled={isAnalyzing}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white 
                       rounded-lg font-medium transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Quality'}
          </motion.button>
        </motion.div>
      )}

      {assessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className="text-center p-6 bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
            <div className="text-4xl font-bold text-success-700 mb-2">
              {assessment.overall_score.toFixed(1)}/10
            </div>
            <p className="text-success-600 font-medium">Overall Quality Score</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span className="text-sm text-success-600">
                {Math.round(assessment.ai_confidence * 100)}% confidence
              </span>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBar 
              label="Freshness" 
              score={assessment.freshness} 
              color="bg-success-500" 
            />
            <ScoreBar 
              label="Appearance" 
              score={assessment.appearance} 
              color="bg-primary-500" 
            />
            <ScoreBar 
              label="Size Consistency" 
              score={assessment.size} 
              color="bg-accent-500" 
            />
            <ScoreBar 
              label="Defect Analysis" 
              score={assessment.defects} 
              color="bg-secondary-500" 
            />
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent-500" />
                Detected Issues
              </h4>
              <ul className="space-y-1">
                {assessment.image_analysis.detected_issues.map((issue: string, index: number) => (
                  <li key={index} className="text-sm text-neutral-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                Recommendations
              </h4>
              <ul className="space-y-1">
                {assessment.image_analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-neutral-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedFile(null);
              setAssessment(null);
            }}
            className="w-full py-2 text-neutral-600 hover:text-neutral-800 
                       transition-colors duration-200"
          >
            Analyze Another Image
          </button>
        </motion.div>
      )}
    </div>
  );
};