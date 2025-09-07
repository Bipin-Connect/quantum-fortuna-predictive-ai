/**
 * apiService.ts
 * Service for handling API requests to the backend for quantum predictions
 */

import { LotteryType, PredictionResult, QuantumKernelParams } from '../types';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

class ApiService {
  private baseUrl: string = '/api';
  private mockMode: boolean = true; // Set to false when real backend is available

  /**
   * Fetch predictions for a specific lottery type
   */
  async fetchPredictions(lotteryType: LotteryType): Promise<ApiResponse<PredictionResult>> {
    if (this.mockMode) {
      return this.mockPredictionResponse(lotteryType);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/predictions/${lotteryType}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return {
        success: false,
        data: {} as PredictionResult,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Submit custom quantum kernel parameters for prediction
   */
  async submitCustomPrediction(
    lotteryType: LotteryType, 
    params: QuantumKernelParams
  ): Promise<ApiResponse<PredictionResult>> {
    if (this.mockMode) {
      return this.mockPredictionResponse(lotteryType, params);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/predictions/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lotteryType, params }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting custom prediction:', error);
      return {
        success: false,
        data: {} as PredictionResult,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Fetch benchmark data comparing quantum vs classical models
   */
  async fetchBenchmarkData(lotteryType: LotteryType): Promise<ApiResponse<any>> {
    if (this.mockMode) {
      return this.mockBenchmarkResponse(lotteryType);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/benchmarks/${lotteryType}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching benchmark data:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Fetch explainability data for model interpretability
   */
  async fetchExplainabilityData(lotteryType: LotteryType, predictionId?: string): Promise<ApiResponse<any>> {
    if (this.mockMode) {
      return this.mockExplainabilityResponse(lotteryType);
    }
    
    try {
      const url = predictionId 
        ? `${this.baseUrl}/explainability/${lotteryType}/${predictionId}`
        : `${this.baseUrl}/explainability/${lotteryType}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching explainability data:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Mock prediction response for development
   */
  private mockPredictionResponse(lotteryType: LotteryType, params?: QuantumKernelParams): ApiResponse<PredictionResult> {
    // Generate random numbers based on lottery type
    const generateNumbers = (count: number, max: number): number[] => {
      const numbers: number[] = [];
      while (numbers.length < count) {
        const num = Math.floor(Math.random() * max) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      return numbers.sort((a, b) => a - b);
    };
    
    // Determine lottery parameters
    let mainCount = 6;
    let mainMax = 49;
    
    if (lotteryType === 'emirates_mega7') {
      mainCount = 7;
      mainMax = 35;
    } else if (lotteryType === 'emirates_easy6') {
      mainCount = 6;
      mainMax = 42;
    } else if (lotteryType === 'powerball') {
      mainCount = 5;
      mainMax = 69;
    }
    
    // Generate prediction data
    const numbers = generateNumbers(mainCount, mainMax);
    const alternativeNumbers = generateNumbers(mainCount, mainMax);
    
    // Add some randomness to the risk profile
    const riskLevels = ['low', 'medium', 'high', 'extreme'];
    const riskIndex = Math.floor(Math.random() * riskLevels.length);
    
    // Generate a plausible rationale
    const rationales = [
      `Based on quantum entropy analysis, these numbers show higher probability patterns in the last 50 draws. The quantum kernel detected subtle correlations in the frequency distribution.`,
      `The prediction leverages historical draw patterns and quantum-inspired feature mapping. The selected numbers have balanced entropy characteristics.`,
      `Using reinforcement learning with quantum feature extraction, these numbers represent an optimal balance between historical frequency and entropy maximization.`,
      `The quantum algorithm identified these numbers based on their statistical properties and pattern analysis from the last 100 draws.`
    ];
    
    return {
      success: true,
      data: {
        lotteryType,
        numbers,
        alternativeNumbers,
        generatedAt: new Date().toISOString(),
        modelVersion: params ? 'custom-v1.0' : 'quantum-v2.1',
        benchmarkScore: 0.68 + (Math.random() * 0.2),
        riskProfile: {
          overallRisk: riskLevels[riskIndex],
          popularityFactor: 0.3 + (Math.random() * 0.4),
          entropyScore: 3.5 + (Math.random() * 2)
        },
        rationale: rationales[Math.floor(Math.random() * rationales.length)],
        kernelParams: params || {
          entanglementDepth: 3,
          shotCount: 1024,
          featureMap: 'ZZFeatureMap',
          optimizationLevel: 2
        }
      }
    };
  }

  /**
   * Mock benchmark response for development
   */
  private mockBenchmarkResponse(lotteryType: LotteryType): ApiResponse<any> {
    return {
      success: true,
      data: {
        lotteryType,
        timestamp: new Date().toISOString(),
        models: [
          {
            name: 'Quantum-Inspired',
            accuracy: 0.21 + (Math.random() * 0.05),
            hitRate: 0.18 + (Math.random() * 0.04),
            processingTime: 120 + (Math.random() * 30)
          },
          {
            name: 'Classical LSTM',
            accuracy: 0.17 + (Math.random() * 0.04),
            hitRate: 0.15 + (Math.random() * 0.03),
            processingTime: 85 + (Math.random() * 20)
          },
          {
            name: 'Random Forest',
            accuracy: 0.16 + (Math.random() * 0.03),
            hitRate: 0.14 + (Math.random() * 0.03),
            processingTime: 65 + (Math.random() * 15)
          },
          {
            name: 'Random Selection',
            accuracy: 0.14 + (Math.random() * 0.02),
            hitRate: 0.14 + (Math.random() * 0.02),
            processingTime: 5 + (Math.random() * 2)
          }
        ],
        timeSeriesData: {
          labels: Array.from({ length: 10 }, (_, i) => `Week ${i+1}`),
          datasets: [
            {
              label: 'Quantum-Inspired',
              data: Array.from({ length: 10 }, () => 0.15 + (Math.random() * 0.1))
            },
            {
              label: 'Classical LSTM',
              data: Array.from({ length: 10 }, () => 0.12 + (Math.random() * 0.08))
            },
            {
              label: 'Random Forest',
              data: Array.from({ length: 10 }, () => 0.11 + (Math.random() * 0.07))
            },
            {
              label: 'Random Selection',
              data: Array.from({ length: 10 }, () => 0.10 + (Math.random() * 0.05))
            }
          ]
        }
      }
    };
  }

  /**
   * Mock explainability response for development
   */
  private mockExplainabilityResponse(lotteryType: LotteryType): ApiResponse<any> {
    // Generate feature importance data
    const features = [
      'Historical Frequency',
      'Last Draw Gap',
      'Positional Patterns',
      'Entropy Score',
      'Co-occurrence Rate',
      'Seasonal Patterns',
      'Number Balance',
      'Quantum Interference',
      'Statistical Moments',
      'Digit Distribution'
    ];
    
    return {
      success: true,
      data: {
        lotteryType,
        timestamp: new Date().toISOString(),
        featureImportance: features.map(feature => ({
          feature,
          importance: 0.2 + (Math.random() * 0.8),
          confidence: 0.5 + (Math.random() * 0.5)
        })).sort((a, b) => b.importance - a.importance),
        shapValues: {
          baseValue: 0.14,
          values: features.map(feature => ({
            feature,
            shapValue: -0.05 + (Math.random() * 0.1)
          }))
        },
        interactionEffects: [
          {
            feature1: 'Historical Frequency',
            feature2: 'Entropy Score',
            strength: 0.6 + (Math.random() * 0.4)
          },
          {
            feature1: 'Quantum Interference',
            feature2: 'Co-occurrence Rate',
            strength: 0.5 + (Math.random() * 0.4)
          },
          {
            feature1: 'Last Draw Gap',
            feature2: 'Positional Patterns',
            strength: 0.4 + (Math.random() * 0.4)
          }
        ]
      }
    };
  }
}

// Export a singleton instance
export const apiService = new ApiService();