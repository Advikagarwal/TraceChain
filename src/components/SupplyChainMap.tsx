import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface SupplyChainLocation {
  id: string;
  name: string;
  type: 'farm' | 'processing' | 'distribution' | 'retail';
  coordinates: { lat: number; lng: number };
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  description: string;
}

const mockLocations: SupplyChainLocation[] = [
  {
    id: '1',
    name: 'Green Valley Farm',
    type: 'farm',
    coordinates: { lat: 38.5816, lng: -122.8324 },
    status: 'completed',
    timestamp: '2024-01-15T08:00:00Z',
    description: 'Organic tomatoes harvested at peak ripeness',
  },
  {
    id: '2',
    name: 'Valley Processing Center',
    type: 'processing',
    coordinates: { lat: 38.2975, lng: -122.2869 },
    status: 'completed',
    timestamp: '2024-01-15T14:30:00Z',
    description: 'Quality inspection and packaging completed',
  },
  {
    id: '3',
    name: 'Distribution Hub LA',
    type: 'distribution',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    status: 'current',
    timestamp: '2024-01-16T09:15:00Z',
    description: 'In transit to retail locations',
  },
  {
    id: '4',
    name: 'Whole Foods Beverly Hills',
    type: 'retail',
    coordinates: { lat: 34.0736, lng: -118.4004 },
    status: 'pending',
    description: 'Awaiting delivery',
  },
];

export const SupplyChainMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] =
    useState<SupplyChainLocation | null>(null);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'farm':
        return <Package className="w-5 h-5" />;
      case 'processing':
        return <Navigation className="w-5 h-5" />;
      case 'distribution':
        return <Truck className="w-5 h-5" />;
      case 'retail':
        return <MapPin className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'current':
        return <Clock className="w-4 h-4 text-accent-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-neutral-400" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-500';
      case 'current':
        return 'bg-accent-500';
      case 'pending':
        return 'bg-neutral-300';
      default:
        return 'bg-neutral-300';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Supply Chain Map
          </h1>
          <p className="text-lg text-neutral-600">
            Visual tracking of produce journey from farm to table
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Interactive Supply Chain Map
              </h3>
              <Navigation className="w-5 h-5 text-primary-500" />
            </div>

            {/* Map Container - In production, this would be a real map component */}
            <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg h-96 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-neutral-700 mb-2">
                    Interactive Map
                  </h4>
                  <p className="text-neutral-500">
                    Map integration would show real locations and routes
                  </p>
                </div>
              </div>

              {/* Location Markers */}
              {mockLocations.map((location, index) => (
                <motion.button
                  key={location.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedLocation(location)}
                  className={`absolute w-8 h-8 ${getStatusColor(
                    location.status
                  )} 
                             rounded-full flex items-center justify-center text-white
                             hover:scale-110 transition-transform duration-200
                             shadow-lg`}
                  style={{
                    left: `${20 + index * 20}%`,
                    top: `${30 + index * 15}%`,
                  }}
                >
                  {index + 1}
                </motion.button>
              ))}

              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {mockLocations.slice(0, -1).map((_, index) => (
                  <motion.line
                    key={index}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    x1={`${20 + index * 20}%`}
                    y1={`${30 + index * 15}%`}
                    x2={`${20 + (index + 1) * 20}%`}
                    y2={`${30 + (index + 1) * 15}%`}
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Location Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Supply Chain Locations
              </h3>

              <div className="space-y-4">
                {mockLocations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      selectedLocation?.id === location.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 ${getStatusColor(location.status)} 
                                     rounded-full flex items-center justify-center text-white`}
                      >
                        {getLocationIcon(location.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900">
                          {location.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(location.status)}
                          <span className="text-sm text-neutral-600 capitalize">
                            {location.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {location.description}
                    </p>
                    {location.timestamp && (
                      <p className="text-xs text-neutral-500 mt-2">
                        {new Date(location.timestamp).toLocaleString()}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Location Details */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              >
                <h4 className="font-semibold text-neutral-900 mb-4">
                  Location Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-neutral-600">Name:</span>
                    <p className="font-medium text-neutral-900">
                      {selectedLocation.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-600">Type:</span>
                    <p className="font-medium text-neutral-900 capitalize">
                      {selectedLocation.type}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-600">Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedLocation.status)}
                      <span className="font-medium text-neutral-900 capitalize">
                        {selectedLocation.status}
                      </span>
                    </div>
                  </div>
                  {selectedLocation.timestamp && (
                    <div>
                      <span className="text-sm text-neutral-600">
                        Timestamp:
                      </span>
                      <p className="font-medium text-neutral-900">
                        {new Date(selectedLocation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-neutral-600">
                      Description:
                    </span>
                    <p className="text-neutral-700 mt-1">
                      {selectedLocation.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
