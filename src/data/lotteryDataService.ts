/**
 * lotteryDataService.ts
 * Service for real-time lottery data ingestion, normalization, and feature engineering
 */

import { LotteryType } from '../types';

export interface LotteryResult {
  drawDate: Date;
  numbers: number[];
  specialNumbers?: number[];
  jackpot?: number;
  winners?: number;
  source: string;
}

export interface LotteryDataStats {
  totalDraws: number;
  lastUpdated: Date;
  frequencyMap: Record<number, number>;
  specialNumberFrequencyMap?: Record<number, number>;
  pairCooccurrence?: Record<string, number>;
  entropyScore?: number;
}

export interface DataIngestionConfig {
  lotteryType: LotteryType;
  refreshInterval?: number; // in milliseconds
  historicalDataDepth?: number; // number of past draws to analyze
  sourceUrl?: string;
}

class LotteryDataService {
  private dataCache: Map<LotteryType, LotteryResult[]> = new Map();
  private statsCache: Map<LotteryType, LotteryDataStats> = new Map();
  private refreshIntervals: Map<LotteryType, NodeJS.Timeout> = new Map();
  
  /**
   * Initialize data service for a specific lottery type
   * @param config Configuration for data ingestion
   */
  public async initializeDataSource(config: DataIngestionConfig): Promise<void> {
    // Clear any existing refresh interval
    if (this.refreshIntervals.has(config.lotteryType)) {
      clearInterval(this.refreshIntervals.get(config.lotteryType)!);
    }
    
    // Initial data load
    await this.fetchLotteryData(config);
    
    // Set up refresh interval if specified
    if (config.refreshInterval && config.refreshInterval > 0) {
      const intervalId = setInterval(
        () => this.fetchLotteryData(config),
        config.refreshInterval
      );
      this.refreshIntervals.set(config.lotteryType, intervalId);
    }
  }
  
  /**
   * Fetch lottery data from source
   * @param config Data ingestion configuration
   */
  private async fetchLotteryData(config: DataIngestionConfig): Promise<void> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll simulate with a mock implementation
      const results = await this.mockFetchData(config.lotteryType);
      
      // Store in cache
      this.dataCache.set(config.lotteryType, results);
      
      // Generate statistics
      const stats = this.generateStatistics(results, config.lotteryType);
      this.statsCache.set(config.lotteryType, stats);
      
      console.log(`Data refreshed for ${config.lotteryType} at ${new Date().toISOString()}`);
    } catch (error) {
      console.error(`Error fetching data for ${config.lotteryType}:`, error);
    }
  }
  
  /**
   * Mock implementation for fetching data
   * In production, this would be replaced with actual API calls
   */
  private async mockFetchData(lotteryType: LotteryType): Promise<LotteryResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results: LotteryResult[] = [];
    const today = new Date();
    
    // Generate mock data based on lottery type
    switch (lotteryType) {
      case 'emirates_mega7':
        for (let i = 0; i < 20; i++) {
          const drawDate = new Date(today);
          drawDate.setDate(today.getDate() - (i * 7)); // Weekly draws
          
          results.push({
            drawDate,
            numbers: Array.from({ length: 7 }, () => Math.floor(Math.random() * 49) + 1),
            jackpot: Math.floor(Math.random() * 10000000) + 1000000,
            winners: Math.floor(Math.random() * 5),
            source: 'Emirates Draw API'
          });
        }
        break;
        
      case 'emirates_easy6':
        for (let i = 0; i < 20; i++) {
          const drawDate = new Date(today);
          drawDate.setDate(today.getDate() - (i * 7));
          
          results.push({
            drawDate,
            numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 42) + 1),
            jackpot: Math.floor(Math.random() * 5000000) + 500000,
            winners: Math.floor(Math.random() * 10),
            source: 'Emirates Draw API'
          });
        }
        break;
        
      // Add more lottery types as needed
      default:
        // Generic lottery format
        for (let i = 0; i < 20; i++) {
          const drawDate = new Date(today);
          drawDate.setDate(today.getDate() - (i * 7));
          
          results.push({
            drawDate,
            numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1),
            specialNumbers: [Math.floor(Math.random() * 10) + 1],
            jackpot: Math.floor(Math.random() * 5000000) + 1000000,
            winners: Math.floor(Math.random() * 3),
            source: 'Generic Lottery API'
          });
        }
    }
    
    return results;
  }
  
  /**
   * Generate statistics from lottery results
   */
  private generateStatistics(results: LotteryResult[], lotteryType: LotteryType): LotteryDataStats {
    const frequencyMap: Record<number, number> = {};
    const specialNumberFrequencyMap: Record<number, number> = {};
    const pairCooccurrence: Record<string, number> = {};
    
    // Calculate frequency of each number
    results.forEach(result => {
      result.numbers.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
      });
      
      // Track special numbers if they exist
      if (result.specialNumbers) {
        result.specialNumbers.forEach(num => {
          specialNumberFrequencyMap[num] = (specialNumberFrequencyMap[num] || 0) + 1;
        });
      }
      
      // Calculate pair co-occurrences
      for (let i = 0; i < result.numbers.length; i++) {
        for (let j = i + 1; j < result.numbers.length; j++) {
          const pair = [result.numbers[i], result.numbers[j]].sort((a, b) => a - b).join('-');
          pairCooccurrence[pair] = (pairCooccurrence[pair] || 0) + 1;
        }
      }
    });
    
    // Calculate entropy score (measure of randomness)
    const totalDraws = results.length;
    const maxPossibleNumber = this.getMaxPossibleNumber(lotteryType);
    const expectedFrequency = totalDraws / maxPossibleNumber;
    
    // Sum of squared differences from expected frequency
    let sumSquaredDiff = 0;
    for (let i = 1; i <= maxPossibleNumber; i++) {
      const observed = frequencyMap[i] || 0;
      const diff = observed - expectedFrequency;
      sumSquaredDiff += (diff * diff);
    }
    
    // Normalize to get entropy score (0-1, higher is more random)
    const entropyScore = 1 - (Math.sqrt(sumSquaredDiff / maxPossibleNumber) / expectedFrequency);
    
    return {
      totalDraws,
      lastUpdated: new Date(),
      frequencyMap,
      specialNumberFrequencyMap: Object.keys(specialNumberFrequencyMap).length > 0 ? specialNumberFrequencyMap : undefined,
      pairCooccurrence,
      entropyScore
    };
  }
  
  /**
   * Get the maximum possible number for a lottery type
   */
  private getMaxPossibleNumber(lotteryType: LotteryType): number {
    switch (lotteryType) {
      case 'emirates_mega7': return 49;
      case 'emirates_easy6': return 42;
      default: return 49; // Default
    }
  }
  
  /**
   * Get lottery results for a specific lottery type
   */
  public getLotteryResults(lotteryType: LotteryType): LotteryResult[] {
    return this.dataCache.get(lotteryType) || [];
  }
  
  /**
   * Get statistics for a specific lottery type
   */
  public getLotteryStats(lotteryType: LotteryType): LotteryDataStats | null {
    return this.statsCache.get(lotteryType) || null;
  }
  
  /**
   * Get the most frequent numbers for a lottery type
   * @param lotteryType The lottery type
   * @param count Number of top frequent numbers to return
   */
  public getMostFrequentNumbers(lotteryType: LotteryType, count: number = 10): number[] {
    const stats = this.statsCache.get(lotteryType);
    if (!stats) return [];
    
    return Object.entries(stats.frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(entry => parseInt(entry[0]));
  }
  
  /**
   * Get the least frequent numbers for a lottery type
   * @param lotteryType The lottery type
   * @param count Number of least frequent numbers to return
   */
  public getLeastFrequentNumbers(lotteryType: LotteryType, count: number = 10): number[] {
    const stats = this.statsCache.get(lotteryType);
    if (!stats) return [];
    
    return Object.entries(stats.frequencyMap)
      .sort((a, b) => a[1] - b[1])
      .slice(0, count)
      .map(entry => parseInt(entry[0]));
  }
  
  /**
   * Get the most common number pairs
   * @param lotteryType The lottery type
   * @param count Number of top pairs to return
   */
  public getMostCommonPairs(lotteryType: LotteryType, count: number = 10): [number, number][] {
    const stats = this.statsCache.get(lotteryType);
    if (!stats || !stats.pairCooccurrence) return [];
    
    return Object.entries(stats.pairCooccurrence)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(entry => entry[0].split('-').map(num => parseInt(num)) as [number, number]);
  }
  
  /**
   * Clean up resources when service is no longer needed
   */
  public dispose(): void {
    this.refreshIntervals.forEach(interval => clearInterval(interval));
    this.refreshIntervals.clear();
    this.dataCache.clear();
    this.statsCache.clear();
  }
}

// Export singleton instance
export const lotteryDataService = new LotteryDataService();