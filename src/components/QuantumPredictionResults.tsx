/**
 * QuantumPredictionResults.tsx
 * Component for displaying quantum prediction results
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { PredictionResult } from '../types';

interface QuantumPredictionResultsProps {
  prediction: PredictionResult;
  isLoading?: boolean;
}

export const QuantumPredictionResults: React.FC<QuantumPredictionResultsProps> = ({ 
  prediction,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
          <AlertCircle className="text-gray-400 mb-4" size={48} />
          <p className="text-gray-400">No prediction data available</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'extreme': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Prediction Set</CardTitle>
            <CardDescription className="text-gray-400">
              Primary recommended numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {prediction.numbers.map((number, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500 flex items-center justify-center text-white font-bold"
                >
                  {number}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Alternative Set</CardTitle>
            <CardDescription className="text-gray-400">
              Secondary prediction option
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {prediction.alternativeNumbers?.map((number, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center text-white font-bold"
                >
                  {number}
                </div>
              )) || (
                <p className="text-gray-400">No alternative set available</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Risk Profile</CardTitle>
            <CardDescription className="text-gray-400">
              Assessment of prediction risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Overall Risk:</span>
                  <span className={getRiskColor(prediction.riskProfile.overallRisk || 'medium')}>
                    {prediction.riskProfile.overallRisk.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
                
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Popularity:</span>
                  <span className="text-white">
                    {(prediction.riskProfile.popularityFactor * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Entropy:</span>
                  <span className="text-white">
                    {prediction.riskProfile.entropyScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Prediction Metrics</CardTitle>
            <CardDescription className="text-gray-400">
              Confidence and benchmarking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Generated:</span>
                  <span className="text-white">
                    {new Date(prediction.generatedAt || Date.now()).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Model Version:</span>
                  <span className="text-white">
                    {prediction.modelVersion || 'v1.0.0'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Benchmark:</span>
                  <span className="text-white">
                    {prediction.benchmarkScore?.toFixed(2) || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Prediction Rationale</CardTitle>
          <CardDescription className="text-gray-400">
            Explanation of the model's decision process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            {prediction.rationale || 'No rationale available'}
          </p>
        </CardContent>
      </Card>
      
      <div className="p-4 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-400 mr-3 mt-1" size={20} />
          <div>
            <h3 className="text-lg font-medium text-yellow-400 mb-2">Educational Disclaimer</h3>
            <p className="text-gray-300 text-sm">
              This dashboard is for educational purposes only. It demonstrates the application of quantum-inspired algorithms 
              and machine learning to analyze lottery data. However, it's important to understand that lottery outcomes are 
              fundamentally random and unpredictable. No algorithm, quantum or otherwise, can predict future lottery results 
              with any advantage over random selection. This tool helps illustrate the mathematical principles and limitations 
              of prediction in truly random systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumPredictionResults;