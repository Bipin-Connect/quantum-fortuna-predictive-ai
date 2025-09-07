/**
 * types.ts
 * Common type definitions used across the application
 */

/**
 * Supported lottery types in the system
 */
export type LotteryType = 
  | 'emirates_mega7'
  | 'emirates_easy6'
  | 'us_powerball'
  | 'euro_millions'
  | 'india_lotto';

/**
 * Quantum kernel parameters for the prediction engine
 */
export interface QuantumKernelParams {
  entanglementDepth: number;  // Depth of quantum circuit entanglement
  shotCount: number;          // Number of quantum circuit executions
  noiseModel?: string;        // Optional noise model to simulate real quantum hardware
  optimizationLevel: number;  // Circuit optimization level (0-3)
  featureMap: string;         // Quantum feature map type ('ZZFeatureMap', 'PauliFeatureMap', etc.)
}

/**
 * Prediction result with confidence metrics
 */
export interface PredictionResult {
  numbers: number[];          // Predicted numbers
  confidenceScores: number[]; // Confidence score for each number (0-1)
  alternativeNumbers?: number[];
  riskProfile: RiskProfile;
  rationale: string;
  generatedAt: Date;
  modelVersion: string;
  benchmarkScore?: number;    // Comparison to classical models
}

/**
 * Risk profile for predictions
 */
export interface RiskProfile {
  overallRisk: 'low' | 'medium' | 'high' | 'extreme';
  popularityFactor: number;   // How common these numbers are (0-1)
  entropyScore: number;       // Randomness measure (0-1)
  expectedValue?: number;     // Expected value calculation
}

/**
 * Feature importance for model explainability
 */
export interface FeatureImportance {
  featureName: string;
  importance: number;         // 0-1 scale
  direction: 'positive' | 'negative' | 'neutral';
  description: string;
}

/**
 * Benchmark comparison with classical models
 */
export interface ModelBenchmark {
  modelName: string;
  accuracy: number;           // 0-1 scale
  hitRate: number;            // 0-1 scale
  processingTime: number;     // milliseconds
  memoryUsage: number;        // MB
  advantageRatio?: number;    // Ratio compared to random selection
}

/**
 * User feedback on predictions
 */
export interface UserFeedback {
  predictionId: string;
  rating: number;             // 1-5 scale
  comments?: string;
  actualResults?: number[];   // Actual drawn numbers if available
  timestamp: Date;
}