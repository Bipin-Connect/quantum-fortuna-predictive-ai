/**
 * BenchmarkingModule.tsx
 * Component for comparing quantum-inspired models with classical prediction approaches
 */

import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ModelBenchmark, LotteryType } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BenchmarkingModuleProps {
  lotteryType: LotteryType;
}

const BenchmarkingModule: React.FC<BenchmarkingModuleProps> = ({ lotteryType }) => {
  const [benchmarks, setBenchmarks] = useState<ModelBenchmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'hitRate' | 'processingTime' | 'memoryUsage' | 'advantageRatio'>('hitRate');
  const [timeSeriesData, setTimeSeriesData] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use mock data
    setIsLoading(true);
    setTimeout(() => {
      setBenchmarks(getMockBenchmarks(lotteryType));
      setTimeSeriesData(getMockTimeSeriesData(lotteryType));
      setIsLoading(false);
    }, 1000);
  }, [lotteryType]);

  const metricLabels = {
    accuracy: 'Prediction Accuracy',
    hitRate: 'Hit Rate',
    processingTime: 'Processing Time (ms)',
    memoryUsage: 'Memory Usage (MB)',
    advantageRatio: 'Advantage Ratio'
  };

  const barChartData = {
    labels: benchmarks.map(benchmark => benchmark.modelName),
    datasets: [
      {
        label: metricLabels[selectedMetric],
        data: benchmarks.map(benchmark => benchmark[selectedMetric] || 0),
        backgroundColor: benchmarks.map(benchmark => {
          // Highlight quantum model
          if (benchmark.modelName.toLowerCase().includes('quantum')) {
            return 'rgba(138, 43, 226, 0.6)'; // Purple for quantum
          } else if (benchmark.modelName.toLowerCase().includes('random')) {
            return 'rgba(169, 169, 169, 0.6)'; // Gray for random
          } else {
            return 'rgba(54, 162, 235, 0.6)'; // Blue for others
          }
        }),
        borderColor: benchmarks.map(benchmark => {
          if (benchmark.modelName.toLowerCase().includes('quantum')) {
            return 'rgb(138, 43, 226)'; 
          } else if (benchmark.modelName.toLowerCase().includes('random')) {
            return 'rgb(169, 169, 169)'; 
          } else {
            return 'rgb(54, 162, 235)'; 
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: `Model Comparison: ${metricLabels[selectedMetric]}`,
        color: 'white',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (selectedMetric === 'processingTime') {
                label += `${context.parsed.y.toFixed(2)} ms`;
              } else if (selectedMetric === 'memoryUsage') {
                label += `${context.parsed.y.toFixed(2)} MB`;
              } else {
                label += context.parsed.y.toFixed(4);
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        beginAtZero: true
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Performance Over Time',
        color: 'white',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        beginAtZero: true
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-4">Model Benchmarking</h2>
      <p className="text-gray-400 mb-6">
        Compare the performance of our quantum-inspired prediction model against classical approaches.
        This module provides transparent benchmarking across multiple metrics.
      </p>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Metric:</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(metricLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedMetric === key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center h-64 bg-gray-800 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 p-4 rounded-lg">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              {timeSeriesData && (
                <Line data={timeSeriesData} options={lineChartOptions} />
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isLoading && benchmarks.map((benchmark) => (
          <div 
            key={benchmark.modelName}
            className={`p-4 rounded-lg border ${benchmark.modelName.toLowerCase().includes('quantum')
              ? 'bg-purple-900/30 border-purple-800/50'
              : benchmark.modelName.toLowerCase().includes('random')
                ? 'bg-gray-800 border-gray-700'
                : 'bg-blue-900/30 border-blue-800/50'
            }`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{benchmark.modelName}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-white font-medium">{benchmark.accuracy.toFixed(4)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Hit Rate:</span>
                <span className="text-white font-medium">{benchmark.hitRate.toFixed(4)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Processing:</span>
                <span className="text-white font-medium">{benchmark.processingTime.toFixed(2)} ms</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Memory:</span>
                <span className="text-white font-medium">{benchmark.memoryUsage.toFixed(2)} MB</span>
              </div>
              
              {benchmark.advantageRatio !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Advantage:</span>
                  <span className="text-white font-medium">{benchmark.advantageRatio.toFixed(2)}x</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-900/30 border border-blue-800/50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-300 mb-2">Benchmarking Methodology</h3>
        <p className="text-gray-300 text-sm">
          Our benchmarking process evaluates models across multiple metrics using historical lottery data. 
          Each model generates predictions for past draw dates without access to the actual results, 
          and performance is measured by comparing predictions to actual outcomes. 
          The baseline random selection model represents the mathematical expectation for a truly random process.
        </p>
        <p className="text-gray-300 text-sm mt-2">
          <strong>Note:</strong> All models, including our quantum-inspired approach, demonstrate performance 
          consistent with the mathematical limitations of predicting truly random events. Any variations 
          from the random baseline are within expected statistical variance and do not indicate predictive advantage.
        </p>
      </div>
    </div>
  );
};

// Mock data generator functions
function getMockBenchmarks(lotteryType: LotteryType): ModelBenchmark[] {
  // Different benchmark values based on lottery type
  // Note: These values are designed to show that no model significantly outperforms random selection
  // in the long run, which is the mathematically correct outcome for truly random events
  
  switch (lotteryType) {
    case 'emirates_mega7':
      return [
        {
          modelName: 'Quantum-Inspired',
          accuracy: 0.0021, // Slightly above random due to statistical variance
          hitRate: 0.0019,
          processingTime: 245.32,
          memoryUsage: 128.45,
          advantageRatio: 1.02 // Essentially no real advantage
        },
        {
          modelName: 'LSTM Neural Network',
          accuracy: 0.0018,
          hitRate: 0.0017,
          processingTime: 189.76,
          memoryUsage: 96.23
        },
        {
          modelName: 'Random Forest',
          accuracy: 0.0019,
          hitRate: 0.0018,
          processingTime: 76.45,
          memoryUsage: 54.12
        },
        {
          modelName: 'Random Selection',
          accuracy: 0.0018, // Baseline random probability
          hitRate: 0.0017,
          processingTime: 12.34,
          memoryUsage: 8.76,
          advantageRatio: 1.00 // Baseline
        },
      ];
      
    case 'emirates_easy6':
      return [
        {
          modelName: 'Quantum-Inspired',
          accuracy: 0.0032,
          hitRate: 0.0029,
          processingTime: 231.87,
          memoryUsage: 124.32,
          advantageRatio: 1.03
        },
        {
          modelName: 'Transformer Model',
          accuracy: 0.0030,
          hitRate: 0.0028,
          processingTime: 203.45,
          memoryUsage: 112.67
        },
        {
          modelName: 'ARIMA',
          accuracy: 0.0027,
          hitRate: 0.0026,
          processingTime: 45.23,
          memoryUsage: 32.45
        },
        {
          modelName: 'Random Selection',
          accuracy: 0.0028,
          hitRate: 0.0027,
          processingTime: 10.12,
          memoryUsage: 7.89,
          advantageRatio: 1.00
        },
      ];
      
    default:
      return [
        {
          modelName: 'Quantum-Inspired',
          accuracy: 0.0025,
          hitRate: 0.0023,
          processingTime: 238.56,
          memoryUsage: 126.78,
          advantageRatio: 1.01
        },
        {
          modelName: 'Deep Learning',
          accuracy: 0.0024,
          hitRate: 0.0022,
          processingTime: 195.67,
          memoryUsage: 104.23
        },
        {
          modelName: 'Statistical Model',
          accuracy: 0.0023,
          hitRate: 0.0022,
          processingTime: 56.78,
          memoryUsage: 42.34
        },
        {
          modelName: 'Random Selection',
          accuracy: 0.0023,
          hitRate: 0.0022,
          processingTime: 11.23,
          memoryUsage: 8.12,
          advantageRatio: 1.00
        },
      ];
  }
}

function getMockTimeSeriesData(lotteryType: LotteryType) {
  // Generate time series data for performance over time
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });
  
  // Generate slightly varying data that shows no model consistently outperforms random
  // over the long term, with some statistical variance
  
  // Quantum model data - shows initial promise but regresses to mean
  const quantumData = [0.0026, 0.0028, 0.0027, 0.0025, 0.0024, 0.0022, 0.0023, 0.0021, 0.0022, 0.0023, 0.0022, 0.0021];
  
  // Classical model - different pattern but same long-term outcome
  const classicalData = [0.0020, 0.0019, 0.0022, 0.0024, 0.0025, 0.0026, 0.0025, 0.0023, 0.0022, 0.0021, 0.0020, 0.0019];
  
  // Random baseline - slight variance around the true probability
  const randomData = [0.0022, 0.0021, 0.0020, 0.0022, 0.0023, 0.0022, 0.0021, 0.0022, 0.0023, 0.0022, 0.0021, 0.0022];
  
  return {
    labels,
    datasets: [
      {
        label: 'Quantum-Inspired',
        data: quantumData,
        borderColor: 'rgb(138, 43, 226)',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Classical Model',
        data: classicalData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Random Selection',
        data: randomData,
        borderColor: 'rgb(169, 169, 169)',
        backgroundColor: 'rgba(169, 169, 169, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      },
    ],
  };
}

export default BenchmarkingModule;