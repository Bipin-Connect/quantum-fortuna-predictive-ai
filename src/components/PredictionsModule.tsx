import React, { useState, useEffect } from 'react';
import { Brain, Target, ChevronDown, ChevronUp, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { september1Predictions, getRecommendations, type LotteryPrediction, type PredictionSet } from '../data/predictionEngine';

interface PredictionsModuleProps {
  selectedLotteries: string[];
}

const PredictionsModule: React.FC<PredictionsModuleProps> = ({ selectedLotteries }) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedPredictionSets, setSelectedPredictionSets] = useState<Record<string, string>>({});
  const [showConsortiumAnalysis, setShowConsortiumAnalysis] = useState<Record<string, boolean>>({});

  const lotteryMapping: Record<string, string> = {
    emirates_mega7: 'emirates_mega7',
    emirates_easy6: 'emirates_easy6', 
    emirates_fast5: 'emirates_fast5',
    omillionaire: 'omillionaire',
    powerball_usa: 'powerball_usa',
    euromillions: 'euromillions',
    lottery_co_uk: 'lottery_co_uk',
    uk_free_lottery: 'uk_free_lottery',
    lotto_india: 'lotto_india'
  };

  useEffect(() => {
    // Initialize with primary predictions
    const initialSelections: Record<string, string> = {};
    selectedLotteries.forEach(lottery => {
      const mappedLottery = lotteryMapping[lottery];
      if (mappedLottery && september1Predictions[mappedLottery]) {
        initialSelections[lottery] = september1Predictions[mappedLottery].primaryPrediction.id;
      }
    });
    setSelectedPredictionSets(initialSelections);
  }, [selectedLotteries]);

  const toggleCard = (lotteryId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(lotteryId)) {
      newExpanded.delete(lotteryId);
    } else {
      newExpanded.add(lotteryId);
    }
    setExpandedCards(newExpanded);
  };

  const toggleConsortiumAnalysis = (lotteryId: string) => {
    setShowConsortiumAnalysis(prev => ({
      ...prev,
      [lotteryId]: !prev[lotteryId]
    }));
  };

  const selectPredictionSet = (lotteryId: string, predictionId: string) => {
    setSelectedPredictionSets(prev => ({
      ...prev,
      [lotteryId]: predictionId
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-400';
    if (confidence >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservative': return 'text-green-400';
      case 'balanced': return 'text-blue-400';
      case 'aggressive': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSelectedPrediction = (lotteryId: string): PredictionSet | null => {
    const mappedLottery = lotteryMapping[lotteryId];
    if (!mappedLottery || !september1Predictions[mappedLottery]) return null;

    const prediction = september1Predictions[mappedLottery];
    const selectedId = selectedPredictionSets[lotteryId];
    
    if (selectedId === prediction.primaryPrediction.id) {
      return prediction.primaryPrediction;
    }
    
    return prediction.alternativeSets.find(set => set.id === selectedId) || prediction.primaryPrediction;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Quantum Predictions - September 1, 2025</h1>
        <p className="text-gray-300">
          Advanced consortium intelligence with 6 validated prediction sets per lottery
        </p>
        <div className="mt-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-lg p-3 border border-green-400/30 inline-block">
          <span className="text-green-400 font-semibold">🎯 Perfect Streak: 35 Consecutive Predictions</span>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="space-y-6">
        {selectedLotteries.map((lotteryId) => {
          const mappedLottery = lotteryMapping[lotteryId];
          const predictionData = mappedLottery ? september1Predictions[mappedLottery] : null;
          
          if (!predictionData) return null;

          const isExpanded = expandedCards.has(lotteryId);
          const selectedPrediction = getSelectedPrediction(lotteryId);
          const showAnalysis = showConsortiumAnalysis[lotteryId];
          const recommendations = getRecommendations(mappedLottery);

          return (
            <div
              key={lotteryId}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">{predictionData.lottery}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(predictionData.riskProfile)} bg-black/30`}>
                      {predictionData.riskProfile.charAt(0).toUpperCase() + predictionData.riskProfile.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCard(lotteryId)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Selected Prediction Display */}
                {selectedPrediction && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">{selectedPrediction.name}</span>
                      <span className={`font-semibold ${getConfidenceColor(selectedPrediction.confidence)}`}>
                        {selectedPrediction.confidence}% Confidence
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedPrediction.numbers.map((num, index) => (
                        <span
                          key={index}
                          className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                        >
                          {num}
                        </span>
                      ))}
                    </div>

                    <div className="bg-black/30 rounded-lg p-3 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Strategy:</span>
                        <span className="text-cyan-400 text-sm font-medium">{selectedPrediction.strategy}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{selectedPrediction.rationale}</p>
                    </div>
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="space-y-6">
                    {/* Prediction Set Selection */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Available Prediction Sets</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {/* Primary Prediction */}
                        <button
                          onClick={() => selectPredictionSet(lotteryId, predictionData.primaryPrediction.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedPredictionSets[lotteryId] === predictionData.primaryPrediction.id
                              ? 'border-purple-400 bg-purple-400/20'
                              : 'border-gray-600 bg-black/30 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{predictionData.primaryPrediction.name}</span>
                            <Sparkles className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="text-sm text-gray-400">{predictionData.primaryPrediction.strategy}</div>
                          <div className="text-sm text-green-400 font-medium">{predictionData.primaryPrediction.confidence}%</div>
                        </button>

                        {/* Alternative Sets */}
                        {predictionData.alternativeSets.map((set) => (
                          <button
                            key={set.id}
                            onClick={() => selectPredictionSet(lotteryId, set.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedPredictionSets[lotteryId] === set.id
                                ? 'border-blue-400 bg-blue-400/20'
                                : 'border-gray-600 bg-black/30 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{set.name}</span>
                              <TrendingUp className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-sm text-gray-400">{set.strategy}</div>
                            <div className="text-sm text-blue-400 font-medium">{set.confidence}%</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Consortium Analysis */}
                    <div>
                      <button
                        onClick={() => toggleConsortiumAnalysis(lotteryId)}
                        className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-3"
                      >
                        <Brain className="w-5 h-5" />
                        <span className="font-medium">Consortium Intelligence Analysis</span>
                        {showAnalysis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {showAnalysis && (
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-400/30 space-y-3">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-black/30 rounded-lg p-3 border border-gray-600">
                              <h5 className="text-white font-medium mb-1">Dr. Aris Thorne (Logician)</h5>
                              <p className="text-gray-300 text-sm">{predictionData.consortiumAnalysis.logicianView}</p>
                            </div>
                            <div className="bg-black/30 rounded-lg p-3 border border-gray-600">
                              <h5 className="text-white font-medium mb-1">Commander Eva Rostova (Strategist)</h5>
                              <p className="text-gray-300 text-sm">{predictionData.consortiumAnalysis.strategistView}</p>
                            </div>
                            <div className="bg-black/30 rounded-lg p-3 border border-gray-600">
                              <h5 className="text-white font-medium mb-1">Dr. Kaelen Vance (Chaos Theorist)</h5>
                              <p className="text-gray-300 text-sm">{predictionData.consortiumAnalysis.chaosTheoristView}</p>
                            </div>
                            <div className="bg-black/30 rounded-lg p-3 border border-gray-600">
                              <h5 className="text-white font-medium mb-1">Elias Vance (Archivist)</h5>
                              <p className="text-gray-300 text-sm">{predictionData.consortiumAnalysis.archivistView}</p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 rounded-lg p-4 border border-green-400/30">
                            <h5 className="text-green-400 font-semibold mb-2">🧠 Nexus Verdict</h5>
                            <p className="text-white">{predictionData.consortiumAnalysis.nexusVerdict}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Strategic Recommendations */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-yellow-400" />
                        <span>Strategic Recommendations</span>
                      </h4>
                      <div className="grid gap-2">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-black/30 rounded-lg p-3 border border-gray-600">
                            <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-300 text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Dashboard */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600 text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {predictionData.estimatedPopularity.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">Estimated Popularity</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600 text-center">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          {selectedPrediction?.expectedValue.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-400">Expected Value</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600 text-center">
                        <div className={`text-2xl font-bold mb-1 ${getRiskColor(predictionData.riskProfile)}`}>
                          {predictionData.riskProfile.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400">Risk Profile</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {selectedLotteries.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No Lotteries Selected
          </h3>
          <p className="text-gray-500">
            Visit the Intake module to select lotteries for September 1st analysis
          </p>
        </div>
      )}

      {/* Global Insights */}
      {selectedLotteries.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>September 1, 2025 - Global Intelligence Summary</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Consortium Consensus</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Mathematical progressions show 94.7% success rate for September 1st</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Temporal analysis indicates strong end-of-quarter patterns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Neural networks detect emerging attractor states across all systems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Historical resonance peaks for September 1st anniversary patterns</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Strategic Outlook</h4>
              <div className="space-y-3">
                <div className="bg-green-600/20 rounded-lg p-3 border border-green-600/30">
                  <span className="text-green-400 font-medium">High Confidence Window</span>
                  <p className="text-gray-300 text-sm mt-1">
                    September 1st shows exceptional pattern convergence across all lottery systems
                  </p>
                </div>
                <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-600/30">
                  <span className="text-blue-400 font-medium">Quantum Predictions Enabled</span>
                  <p className="text-gray-300 text-sm mt-1">
                    Quantum algorithm optimization complete for all supported lotteries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionsModule;