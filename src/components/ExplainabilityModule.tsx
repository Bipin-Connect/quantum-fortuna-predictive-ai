/**
 * ExplainabilityModule.tsx
 * Component for visualizing feature importance and model explainability
 */

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FeatureImportance, LotteryType } from '../types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExplainabilityModuleProps {
  lotteryType: LotteryType;
  predictionId?: string;
}

const ExplainabilityModule: React.FC<ExplainabilityModuleProps> = ({ lotteryType, predictionId }) => {
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<FeatureImportance | null>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use mock data
    setIsLoading(true);
    setTimeout(() => {
      setFeatureImportance(getMockFeatureImportance(lotteryType));
      setIsLoading(false);
    }, 1000);
  }, [lotteryType, predictionId]);

  const chartData = {
    labels: featureImportance.map(feature => feature.featureName),
    datasets: [
      {
        label: 'Feature Importance',
        data: featureImportance.map(feature => feature.importance),
        backgroundColor: featureImportance.map(feature => {
          switch (feature.direction) {
            case 'positive': return 'rgba(75, 192, 192, 0.6)';
            case 'negative': return 'rgba(255, 99, 132, 0.6)';
            default: return 'rgba(201, 203, 207, 0.6)';
          }
        }),
        borderColor: featureImportance.map(feature => {
          switch (feature.direction) {
            case 'positive': return 'rgb(75, 192, 192)';
            case 'negative': return 'rgb(255, 99, 132)';
            default: return 'rgb(201, 203, 207)';
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Feature Importance (SHAP Values)',
        color: 'white',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const feature = featureImportance[context.dataIndex];
            return `Importance: ${feature.importance.toFixed(3)} (${feature.direction})`;
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
      },
    },
  };

  const handleFeatureClick = (_event: any, elements: any) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      setSelectedFeature(featureImportance[index]);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-4">Model Explainability</h2>
      <p className="text-gray-400 mb-6">
        This module visualizes the importance of different features in the prediction model using SHAP (SHapley Additive exPlanations) values.
        Click on any feature to see more details about its impact on predictions.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg">
              <Bar 
                data={chartData} 
                options={chartOptions} 
                onClick={(event) => {
                  const elements = (event as unknown as {chart: ChartJS}).chart.getActiveElements();
                  handleFeatureClick(event, elements);
                }}
              />
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-3">Feature Details</h3>
          
          {selectedFeature ? (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-medium text-white">{selectedFeature.featureName}</h4>
                <div className="flex items-center mt-2">
                  <span className="text-gray-400 mr-2">Importance:</span>
                  <span className="font-semibold text-white">{selectedFeature.importance.toFixed(3)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-gray-400 mr-2">Direction:</span>
                  <span className={
                    selectedFeature.direction === 'positive' ? 'text-green-400' :
                    selectedFeature.direction === 'negative' ? 'text-red-400' :
                    'text-gray-400'
                  }>
                    {selectedFeature.direction.charAt(0).toUpperCase() + selectedFeature.direction.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-gray-300">{selectedFeature.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a feature from the chart to see detailed information about its impact on the prediction model.</p>
          )}
          
          <div className="mt-6">
            <h4 className="text-lg font-medium text-white mb-2">Understanding SHAP Values</h4>
            <p className="text-gray-400 text-sm">
              SHAP values show how much each feature contributes to the prediction, either positively or negatively.
              Higher absolute values indicate stronger influence on the model's output.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-900/30 border border-blue-800/50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-300 mb-2">Educational Note</h3>
        <p className="text-gray-300 text-sm">
          While this explainability module provides insights into how our model works, it's important to remember that
          lottery outcomes are fundamentally random and unpredictable. These visualizations are for educational purposes
          to demonstrate how AI models process data, not to suggest any predictive advantage.
        </p>
      </div>
    </div>
  );
};

// Mock data generator function
function getMockFeatureImportance(lotteryType: LotteryType): FeatureImportance[] {
  // Different features based on lottery type
  switch (lotteryType) {
    case 'emirates_mega7':
      return [
        {
          featureName: 'Historical Frequency',
          importance: 0.32,
          direction: 'positive',
          description: 'How often each number has appeared in past draws. More frequent numbers show a slight positive correlation in our model, though this is likely statistical noise rather than predictive signal.'
        },
        {
          featureName: 'Number Spacing',
          importance: 0.28,
          direction: 'neutral',
          description: 'The distribution of gaps between consecutive numbers in a selection. The model identifies certain spacing patterns, though these patterns have no causal relationship with future outcomes.'
        },
        {
          featureName: 'Even/Odd Ratio',
          importance: 0.21,
          direction: 'negative',
          description: 'The balance between even and odd numbers in a selection. Extreme imbalances (all even or all odd) are statistically rare but not impossible.'
        },
        {
          featureName: 'Sum Total',
          importance: 0.18,
          direction: 'neutral',
          description: 'The sum of all selected numbers. Most combinations fall within a predictable range, with extreme values being mathematically less common.'
        },
        {
          featureName: 'Consecutive Numbers',
          importance: 0.15,
          direction: 'negative',
          description: 'The presence of consecutive numbers (e.g., 23, 24, 25) in a selection. While these appear less frequently in historical data, this is purely coincidental.'
        },
        {
          featureName: 'Number Range Coverage',
          importance: 0.12,
          direction: 'positive',
          description: 'How well the selection covers the entire range of possible numbers. Broader coverage correlates slightly with historical patterns.'
        },
        {
          featureName: 'Decade Distribution',
          importance: 0.09,
          direction: 'neutral',
          description: 'How numbers are distributed across different decades (1-10, 11-20, etc.). The model identifies certain decade patterns in historical data.'
        },
        {
          featureName: 'Last Draw Similarity',
          importance: 0.07,
          direction: 'negative',
          description: 'Similarity to the previous draw\'s numbers. The model shows a slight negative correlation with high similarity to recent draws.'
        },
      ];
      
    case 'emirates_easy6':
      return [
        {
          featureName: 'Number Frequency',
          importance: 0.29,
          direction: 'positive',
          description: 'Historical appearance frequency of each number. The model identifies certain numbers appearing more often, though this is expected statistical variance rather than predictive.'
        },
        {
          featureName: 'Sum Range',
          importance: 0.26,
          direction: 'neutral',
          description: 'The total sum of selected numbers. Certain sum ranges appear more frequently in historical data due to mathematical probability.'
        },
        {
          featureName: 'High/Low Split',
          importance: 0.22,
          direction: 'positive',
          description: 'Balance between numbers from the lower half and upper half of the possible range. Balanced selections appear slightly more often in historical data.'
        },
        {
          featureName: 'Pattern Repetition',
          importance: 0.19,
          direction: 'negative',
          description: 'Repetition of specific number patterns from previous draws. The model shows these are slightly less likely to repeat immediately.'
        },
        {
          featureName: 'Number Gaps',
          importance: 0.17,
          direction: 'neutral',
          description: 'The size of gaps between numbers when sorted. Certain gap patterns appear in historical data with varying frequencies.'
        },
        {
          featureName: 'Numerical Symmetry',
          importance: 0.14,
          direction: 'positive',
          description: 'Symmetrical properties of the number selection when mapped mathematically. Some symmetrical patterns show slight positive correlation.'
        },
        {
          featureName: 'Calendar Numbers',
          importance: 0.11,
          direction: 'negative',
          description: 'Numbers corresponding to calendar dates (1-31). These numbers are often overselected by players but show no advantage in actual draws.'
        },
      ];
    
    case 'us_powerball':
      return [
        {
          featureName: 'Powerball Selection',
          importance: 0.35,
          direction: 'positive',
          description: 'The special Powerball number selection strategy. Certain Powerball numbers show slight statistical variations in historical data.'
        },
        {
          featureName: 'Main Number Distribution',
          importance: 0.28,
          direction: 'neutral',
          description: 'How the five main numbers are distributed across the 1-69 range. Broader distribution patterns align with mathematical probability.'
        },
        {
          featureName: 'Hot/Cold Numbers',
          importance: 0.22,
          direction: 'positive',
          description: 'Analysis of frequently drawn (hot) versus rarely drawn (cold) numbers. The model shows slight correlation with hot numbers, though this is likely statistical variance.'
        },
        {
          featureName: 'Number Sum Range',
          importance: 0.19,
          direction: 'neutral',
          description: 'The total sum of the five main numbers. Certain sum ranges appear more frequently due to mathematical probability.'
        },
        {
          featureName: 'Powerball Parity',
          importance: 0.16,
          direction: 'negative',
          description: 'Whether the Powerball is odd or even. Historical data shows slight variations that are likely coincidental.'
        },
        {
          featureName: 'Previous Winners Pattern',
          importance: 0.12,
          direction: 'negative',
          description: 'Similarity to previous jackpot-winning combinations. The model shows these patterns are less likely to repeat immediately.'
        },
        {
          featureName: 'Number Grouping',
          importance: 0.09,
          direction: 'neutral',
          description: 'How numbers cluster or spread across the possible range. Certain grouping patterns appear in historical data with varying frequencies.'
        },
      ];
      
    case 'euro_millions':
      return [
        {
          featureName: 'Star Number Selection',
          importance: 0.33,
          direction: 'positive',
          description: 'The selection strategy for the two special star numbers. Certain combinations of star numbers show slight statistical variations.'
        },
        {
          featureName: 'Main Number Coverage',
          importance: 0.27,
          direction: 'neutral',
          description: 'How well the five main numbers cover the 1-50 range. Broader coverage correlates with mathematical probability.'
        },
        {
          featureName: 'Star Number Patterns',
          importance: 0.23,
          direction: 'positive',
          description: 'Patterns in the selection of star numbers. Certain combinations appear more frequently in historical data.'
        },
        {
          featureName: 'Regional Popularity',
          importance: 0.18,
          direction: 'negative',
          description: 'Numbers commonly selected by players in different European regions. Popular selections show slightly lower expected value due to shared jackpots.'
        },
        {
          featureName: 'Draw Day Variation',
          importance: 0.15,
          direction: 'neutral',
          description: 'Statistical differences between Tuesday and Friday draws. The model identifies slight variations that are likely coincidental.'
        },
        {
          featureName: 'Historical Jackpot Patterns',
          importance: 0.11,
          direction: 'negative',
          description: 'Patterns from previous jackpot-winning combinations. The model shows these are unlikely to repeat in the short term.'
        },
        {
          featureName: 'Number Sum Distribution',
          importance: 0.08,
          direction: 'neutral',
          description: 'The distribution of the sum of all selected numbers. Most combinations fall within a predictable range based on mathematical probability.'
        },
      ];
      
    case 'india_lotto':
      return [
        {
          featureName: 'Regional Number Preference',
          importance: 0.31,
          direction: 'positive',
          description: 'Numbers that are culturally significant or considered lucky in different regions of India. These show slight statistical variations in historical data.'
        },
        {
          featureName: 'Number Balance',
          importance: 0.26,
          direction: 'neutral',
          description: 'Balance between low (1-25) and high (26-49) numbers. More balanced selections align with mathematical probability.'
        },
        {
          featureName: 'Numerical Patterns',
          importance: 0.22,
          direction: 'positive',
          description: 'Recurring patterns in historical draws. The model identifies certain patterns, though these have no predictive value for future draws.'
        },
        {
          featureName: 'Draw Frequency Analysis',
          importance: 0.17,
          direction: 'neutral',
          description: 'Analysis of how frequently each number appears across all historical draws. Some numbers show slight statistical variations.'
        },
        {
          featureName: 'Sequential Selection',
          importance: 0.14,
          direction: 'negative',
          description: 'The presence of sequential numbers in a selection. These appear less frequently in historical data, though this is purely coincidental.'
        },
        {
          featureName: 'Sum Total Range',
          importance: 0.11,
          direction: 'neutral',
          description: 'The sum of all selected numbers. Certain sum ranges appear more frequently due to mathematical probability.'
        },
        {
          featureName: 'Previous Draw Influence',
          importance: 0.08,
          direction: 'negative',
          description: 'Influence of previous draw results on current selection. The model shows minimal correlation between consecutive draws.'
        },
      ];
      
    default:
      return [
        {
          featureName: 'Number Frequency',
          importance: 0.25,
          direction: 'neutral',
          description: 'Historical frequency of each number appearing in draws. The model identifies frequency patterns, though these have no predictive power for truly random draws.'
        },
        {
          featureName: 'Statistical Balance',
          importance: 0.22,
          direction: 'positive',
          description: 'How well the selection represents statistical balance across various mathematical properties. More balanced selections appear slightly more often in historical data.'
        },
        {
          featureName: 'Pattern Analysis',
          importance: 0.18,
          direction: 'neutral',
          description: 'Analysis of patterns in the number selection. The model identifies certain patterns in historical data, though these are coincidental rather than predictive.'
        },
        {
          featureName: 'Temporal Factors',
          importance: 0.15,
          direction: 'negative',
          description: 'Relationship between draw timing and number selection. The model shows no significant correlation, as expected with a properly randomized lottery.'
        },
        {
          featureName: 'Mathematical Properties',
          importance: 0.12,
          direction: 'neutral',
          description: 'Various mathematical properties of the number selection. Certain properties appear with different frequencies in historical data.'
        },
      ];
  }
}

export default ExplainabilityModule;