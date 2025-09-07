/**
 * QuantumPredictionHistory.tsx
 * Component for displaying historical quantum predictions
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PredictionResult } from '../types';

interface QuantumPredictionHistoryProps {
  predictions: PredictionResult[];
  onSelectPrediction?: (prediction: PredictionResult) => void;
}

export const QuantumPredictionHistory: React.FC<QuantumPredictionHistoryProps> = ({ 
  predictions,
  onSelectPrediction
}) => {
  if (!predictions || predictions.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Prediction History</CardTitle>
          <CardDescription className="text-gray-400">
            Track your previous quantum predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">No prediction history available</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatNumbers = (numbers: number[]): string => {
    return numbers.join(', ');
  };

  const getRiskBadgeClass = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Prediction History</CardTitle>
        <CardDescription className="text-gray-400">
          Track your previous quantum predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Lottery</TableHead>
                <TableHead className="text-gray-300">Numbers</TableHead>
                <TableHead className="text-gray-300">Risk</TableHead>
                <TableHead className="text-gray-300">Model</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction, index) => (
                <TableRow 
                  key={index} 
                  className={onSelectPrediction ? 'cursor-pointer hover:bg-gray-800/50' : ''}
                  onClick={() => onSelectPrediction && onSelectPrediction(prediction)}
                >
                  <TableCell className="text-gray-400">
                    {formatDate(prediction.generatedAt)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {prediction.lotteryType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatNumbers(prediction.numbers)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskBadgeClass(prediction.riskProfile.overallRisk)}`}>
                      {prediction.riskProfile.overallRisk.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {prediction.modelVersion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumPredictionHistory;