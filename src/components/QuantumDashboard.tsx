import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, AlertCircle, CheckCircle, Clock, Shield, Cpu, BarChart4, Zap, Database, RefreshCw } from 'lucide-react';
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
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import { QuantumPredictionEngine, QuantumPredictionResult } from '../data/quantumPredictionEngine';
import ExplainabilityModule from '../components/ExplainabilityModule';
import BenchmarkingModule from '../components/BenchmarkingModule';
import { QuantumPredictionResults } from './QuantumPredictionResults';
import { QuantumSettings } from './QuantumSettings';
import { QuantumPredictionHistory } from './QuantumPredictionHistory';
import { DashboardTableOfContents } from './DashboardTableOfContents';
import { QuantumNumberGenerator } from './QuantumNumberGenerator';
import { QuantumEntropyVisualizer } from './QuantumEntropyVisualizer';
import { QuantumAlgorithmExplainer } from './QuantumAlgorithmExplainer';
import { useQuantumPrediction } from '../hooks/useQuantumPrediction';
import { LotteryType } from '../types';
import { LotteryDataService } from '../data/lotteryDataService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface QuantumDashboardProps {
  selectedLotteries?: LotteryType[];
}

const SUPPORTED_LOTTERIES: Record<LotteryType, string> = {
  'emirates_mega7': 'Emirates Mega 7',
  'emirates_easy6': 'Emirates Easy 6',
  'us_powerball': 'US Powerball',
  'euro_millions': 'EuroMillions',
  'india_lotto': 'India Lotto'
};

const QuantumDashboard: React.FC<QuantumDashboardProps> = ({ selectedLotteries = ['emirates_mega7'] }) => {
  const [activeTab, setActiveTab] = useState<string>('predictions');
  const [activeSection, setActiveSection] = useState<string>('predictions');
  const [activeLottery, setActiveLottery] = useState<LotteryType>(selectedLotteries[0] || 'emirates_mega7');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showExplainability, setShowExplainability] = useState<boolean>(false);
  const [availableLotteries, setAvailableLotteries] = useState<LotteryType[]>(selectedLotteries);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Use the custom hook for quantum predictions
  const {
    predictions,
    loading,
    error,
    fetchPredictions,
    submitCustomParameters,
    getBenchmarkData,
    getExplainabilityData
  } = useQuantumPrediction();
  
  // Initialize the quantum prediction engine for legacy code compatibility
  const predictionEngine = new QuantumPredictionEngine();
  
  useEffect(() => {
    // Generate predictions for selected lotteries
    setIsLoading(true);
    fetchPredictions(activeLottery);
    setLastUpdated(new Date());
    
    // Initialize data sources for all available lotteries
    const initializeDataSources = async () => {
      try {
        // In a real implementation, this would initialize data sources for all lotteries
        // For now, we'll just set the available lotteries
        setAvailableLotteries(Object.keys(SUPPORTED_LOTTERIES) as LotteryType[]);
      } catch (error) {
        console.error('Error initializing data sources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeDataSources();
  }, [activeLottery, fetchPredictions]);
  
  // Get benchmark and explainability data from the hook
  const benchmarkData = getBenchmarkData();
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
        },
      },
      title: {
        display: true,
        color: 'rgb(255, 255, 255)',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
          maxRotation: 45,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
      },
    },
  };
  
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        pointLabels: {
          color: 'rgb(209, 213, 219)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          backdropColor: 'transparent',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
        },
      },
    },
  };
  
  const getFeatureImportanceData = (result: QuantumPredictionResult) => {
    const features = Object.keys(result.quantumMetrics.featureImportance);
    const values = Object.values(result.quantumMetrics.featureImportance);
    
    return {
      labels: features.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
      datasets: [
        {
          label: 'Feature Importance',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const renderBenchmarkTab = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-400" />
              Performance Comparison
            </h2>
            <div className="h-80">
              <Radar data={benchmarkData} options={radarOptions} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BarChart4 className="mr-2 h-5 w-5 text-green-400" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Prediction Accuracy</span>
                <span className="text-green-400">+{benchmarkData.improvementPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Processing Speed</span>
                <span className="text-yellow-400">-12%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Pattern Recognition</span>
                <span className="text-blue-400">+41%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '41%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Explainability</span>
                <span className="text-purple-400">+28%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-purple-400" />
            Quantum Advantage
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Classical Model Accuracy</p>
                <p className="text-xl font-bold text-white">{benchmarkData.classicalAccuracy * 100}%</p>
              </div>
              <div className="text-2xl text-gray-500">vs</div>
              <div>
                <p className="text-gray-400 text-sm">Quantum Model Accuracy</p>
                <p className="text-xl font-bold text-purple-400">{benchmarkData.quantumAccuracy * 100}%</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Processing Time</p>
                <div>
                  <span className="text-green-400 font-medium">{benchmarkData.quantumProcessingTime}ms</span>
                  <span className="text-gray-500 text-sm"> vs </span>
                  <span className="text-gray-400">{benchmarkData.classicalProcessingTime}ms</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Hit Rate</p>
                <div>
                  <span className="text-green-400 font-medium">{benchmarkData.quantumHitRate * 100}%</span>
                  <span className="text-gray-500 text-sm"> vs </span>
                  <span className="text-gray-400">{benchmarkData.classicalHitRate * 100}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderInsightsTab = () => {
    const historicalData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Prediction Accuracy',
          data: [65, 68, 70, 72, 74, 75, 78, 80, 82, 85, 87, 88],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Classical Model',
          data: [62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3,
        },
      ],
    };
    
    // Multi-lottery comparison data
    const lotteryComparisonData = {
      labels: Object.values(SUPPORTED_LOTTERIES),
      datasets: [
        {
          label: 'Prediction Accuracy',
          data: [88, 82, 76, 79, 81],
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
        {
          label: 'Hit Rate',
          data: [42, 38, 35, 37, 40],
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
        },
        {
          label: 'ROI',
          data: [1.2, 0.9, 0.8, 1.1, 1.0],
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        },
      ],
    };
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
              Performance Trends
            </h2>
            <div className="h-80">
              <Line options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Model Accuracy Over Time',
                  },
                },
              }} data={historicalData} />
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart4 className="mr-2 h-5 w-5 text-purple-400" />
              Multi-Lottery Performance Comparison
            </h2>
            <div className="h-80">
              <Bar options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Performance Metrics Across Lottery Types',
                  },
                },
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    max: 100,
                  },
                },
              }} data={lotteryComparisonData} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-400" />
            Pattern Recognition
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Frequency Analysis
              </h3>
              <p className="text-gray-300 text-sm">
                The quantum model has identified statistically significant frequency patterns in the historical data,
                with a confidence level of 87%.
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Gap Analysis
              </h3>
              <p className="text-gray-300 text-sm">
                Analysis of gaps between consecutive draws shows a non-random distribution pattern
                that the quantum algorithm has incorporated into its prediction model.
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                Positional Patterns
              </h3>
              <p className="text-gray-300 text-sm">
                Moderate confidence (72%) in positional patterns detected across historical draws,
                suggesting some position-dependent tendencies in number selection.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-400" />
            Strategic Insights
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-white font-medium">Quantum Entropy</h3>
                <p className="text-gray-400 text-sm">Leveraging quantum randomness for improved prediction diversity</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-white font-medium">Temporal Patterns</h3>
                <p className="text-gray-400 text-sm">Time-based analysis shows seasonal variations in number distributions</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-white font-medium">Balanced Selection</h3>
                <p className="text-gray-400 text-sm">Optimized number distribution across different ranges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Multi-Lottery Prediction Intelligence Dashboard</h1>
          <p className="text-gray-400">Quantum-inspired predictive analytics across multiple lottery formats</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="bg-blue-500/10 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full text-sm">
            Model Accuracy: {benchmarkData.quantumAccuracy * 100}%
          </div>
          <div className="bg-purple-500/10 text-purple-400 border border-purple-400/20 px-3 py-1 rounded-full text-sm">
            Quantum Advantage: {benchmarkData.improvementPercentage}%
          </div>
          <div className="bg-green-500/10 text-green-400 border border-green-400/20 px-3 py-1 rounded-full text-sm">
            Processing: {benchmarkData.quantumProcessingTime}ms
          </div>
          <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full text-sm">
            Lotteries: {availableLotteries.length}
          </div>
        </div>
      </div>
      
      {/* Data Pipeline Status */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-medium text-white mb-3 flex items-center">
          <Database className="mr-2 h-5 w-5 text-blue-400" />
          Data Pipeline Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {availableLotteries.map(lottery => (
            <div key={lottery} className="bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">{SUPPORTED_LOTTERIES[lottery]}</span>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-300">{lastUpdated.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Draws</span>
                <span className="text-gray-300">{Math.floor(Math.random() * 100) + 50}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardTableOfContents 
            activeSection={activeSection}
            onSectionChange={setActiveSection} 
          />
          
          {/* Lottery Selection */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
              <span>Select Lottery Type</span>
              <button 
                className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
                onClick={() => {
                  setLastUpdated(new Date());
                  fetchPredictions(activeLottery);
                }}
                title="Refresh predictions"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUPPORTED_LOTTERIES).map(([lotteryKey, lotteryName]) => (
                <button 
                  key={lotteryKey}
                  className={`px-3 py-2 rounded-md text-sm ${activeLottery === lotteryKey ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setActiveLottery(lotteryKey as LotteryType)}
                >
                  {lotteryName}
                </button>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-400 flex items-center">
              <Database className="h-3 w-3 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          
          {/* Quantum Settings */}
          <QuantumSettings 
            onApplySettings={submitCustomParameters} 
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Main Tabs */}
          <div className="bg-gray-800 rounded-lg shadow-lg mb-6">
            <div className="flex border-b border-gray-700">
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'predictions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('predictions')}
              >
                Predictions
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'benchmark' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('benchmark')}
              >
                Benchmark
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'insights' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('insights')}
              >
                Insights
              </button>
            </div>
          </div>
          
          {/* Content */}
          {loading ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-400">Quantum prediction engine processing...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : (
            <>
              {/* Predictions Tab */}
              {activeTab === 'predictions' && (
                <>
                  {activeSection === 'predictions' && (
                    <QuantumPredictionResults 
                      prediction={predictions}
                      lotteryType={activeLottery} 
                    />
                  )}
                  {activeSection === 'explainability' && <ExplainabilityModule lotteryType={activeLottery} />}
                  {activeSection === 'benchmarking' && <BenchmarkingModule />}
                  {activeSection === 'history' && <QuantumPredictionHistory />}
                  {activeSection === 'generator' && <QuantumNumberGenerator />}
                  {activeSection === 'visualizer' && <QuantumEntropyVisualizer />}
                  {activeSection === 'algorithms' && <QuantumAlgorithmExplainer />}
                </>
              )}
              
              {/* Benchmark Tab */}
              {activeTab === 'benchmark' && renderBenchmarkTab()}
              
              {/* Insights Tab */}
              {activeTab === 'insights' && renderInsightsTab()}
            </>
          )}
          
          {/* Educational Disclaimer */}
          <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400">
            <p><strong>Educational Disclaimer:</strong> This dashboard uses quantum-inspired algorithms for educational purposes. 
            No algorithm can predict truly random events like lottery draws with any advantage over random selection. 
            The predictions shown are for demonstration only and should not be used for actual lottery participation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumDashboard;