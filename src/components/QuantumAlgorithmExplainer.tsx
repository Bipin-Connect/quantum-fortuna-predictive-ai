/**
 * QuantumAlgorithmExplainer.tsx
 * Component for explaining quantum algorithms used in the dashboard
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Cpu, Zap, Network, Dices, Sigma } from 'lucide-react';

interface QuantumAlgorithmExplainerProps {
  className?: string;
}

export const QuantumAlgorithmExplainer: React.FC<QuantumAlgorithmExplainerProps> = ({ 
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-purple-400" />
          Quantum Algorithm Explorer
        </CardTitle>
        <CardDescription className="text-gray-400">
          Learn about quantum algorithms used in this dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="qknn" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Q-KNN
            </TabsTrigger>
            <TabsTrigger value="qsvm" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Q-SVM
            </TabsTrigger>
            <TabsTrigger value="vqe" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              VQE
            </TabsTrigger>
            <TabsTrigger value="qml" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              QML
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <Cpu className="w-5 h-5 text-blue-400 mr-2" />
                Quantum-Inspired Algorithms
              </h3>
              <p className="text-gray-300 text-sm">
                This dashboard uses quantum-inspired algorithms that simulate certain properties of quantum computing
                without requiring actual quantum hardware. These algorithms leverage principles like superposition,
                entanglement, and quantum interference to analyze patterns in lottery data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-base font-medium text-blue-400 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Superposition
                </h4>
                <p className="text-gray-300 text-sm">
                  Allows algorithms to explore multiple possibilities simultaneously, enabling more efficient
                  pattern recognition in historical lottery data.
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-base font-medium text-green-400 mb-2 flex items-center">
                  <Network className="w-4 h-4 mr-2" />
                  Entanglement
                </h4>
                <p className="text-gray-300 text-sm">
                  Creates correlations between different data points, helping identify hidden relationships
                  between lottery numbers and drawing patterns.
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-base font-medium text-purple-400 mb-2 flex items-center">
                  <Dices className="w-4 h-4 mr-2" />
                  Quantum Randomness
                </h4>
                <p className="text-gray-300 text-sm">
                  Provides higher-quality random number generation for simulations and Monte Carlo methods
                  used in prediction confidence intervals.
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-base font-medium text-yellow-400 mb-2 flex items-center">
                  <Sigma className="w-4 h-4 mr-2" />
                  Quantum Feature Mapping
                </h4>
                <p className="text-gray-300 text-sm">
                  Transforms classical data into quantum states, allowing for more complex pattern recognition
                  in high-dimensional feature spaces.
                </p>
              </div>
            </div>
            
            <div className="bg-red-900/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30 mt-4">
              <p className="text-sm text-gray-300">
                <strong className="text-red-400">Educational Note:</strong> While these algorithms use quantum-inspired
                techniques, it's important to understand that no algorithm can predict truly random events like lottery
                draws with any advantage over random selection. This dashboard is for educational purposes only.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="qknn" className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
              <h3 className="text-lg font-medium text-white mb-2">Quantum K-Nearest Neighbors</h3>
              <p className="text-gray-300 text-sm">
                Q-KNN is a quantum-inspired version of the classical K-Nearest Neighbors algorithm. It uses quantum
                computing principles to calculate distances between data points in superposition, potentially
                offering quadratic speedup for pattern recognition in large datasets.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-blue-400 mb-2">How It Works</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Historical lottery data is encoded into quantum feature vectors</li>
                <li>Quantum interference is used to calculate distances between all data points simultaneously</li>
                <li>Measurement collapses the quantum state to identify the k-nearest neighbors</li>
                <li>Voting among neighbors determines the most likely number combinations</li>
              </ol>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-green-400 mb-2">Advantages</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>Efficient distance calculations in high-dimensional spaces</li>
                <li>Better handling of noisy data through quantum amplitude amplification</li>
                <li>Improved pattern recognition for complex relationships</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="qsvm" className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
              <h3 className="text-lg font-medium text-white mb-2">Quantum Support Vector Machine</h3>
              <p className="text-gray-300 text-sm">
                Q-SVM leverages quantum computing to perform the kernel calculations in Support Vector Machines.
                It can efficiently compute kernel functions that would be exponentially complex on classical computers,
                potentially finding more sophisticated patterns in lottery data.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-blue-400 mb-2">How It Works</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Data is mapped to a quantum feature space using quantum circuits</li>
                <li>Quantum kernel matrices are computed using inner products of quantum states</li>
                <li>The kernel matrix is used in a classical SVM optimizer</li>
                <li>The resulting model identifies hyperplanes separating different lottery outcome patterns</li>
              </ol>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-green-400 mb-2">Advantages</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>Access to exponentially large feature spaces</li>
                <li>Ability to compute complex kernel functions efficiently</li>
                <li>Better classification of non-linearly separable data patterns</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="vqe" className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
              <h3 className="text-lg font-medium text-white mb-2">Variational Quantum Eigensolver</h3>
              <p className="text-gray-300 text-sm">
                VQE is a hybrid quantum-classical algorithm used for optimization problems. In the context of
                lottery analysis, it can be used to find optimal number combinations that maximize certain
                statistical properties based on historical data.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-blue-400 mb-2">How It Works</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>A problem Hamiltonian is constructed representing the optimization objective</li>
                <li>A parameterized quantum circuit (ansatz) prepares trial states</li>
                <li>Quantum measurements estimate the expectation value of the Hamiltonian</li>
                <li>Classical optimizer adjusts circuit parameters to minimize energy</li>
                <li>The process iterates until convergence to an optimal solution</li>
              </ol>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-green-400 mb-2">Advantages</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>Can solve complex optimization problems efficiently</li>
                <li>Works well on current noisy quantum hardware</li>
                <li>Hybrid approach leverages strengths of both quantum and classical computing</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="qml" className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
              <h3 className="text-lg font-medium text-white mb-2">Quantum Machine Learning</h3>
              <p className="text-gray-300 text-sm">
                QML encompasses various techniques that combine quantum computing with machine learning.
                These approaches can potentially identify complex patterns in lottery data that would be
                difficult to detect using classical methods alone.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-blue-400 mb-2">Key Techniques</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li><strong className="text-purple-400">Quantum Neural Networks:</strong> Neural networks where some or all components are quantum</li>
                <li><strong className="text-purple-400">Quantum Boltzmann Machines:</strong> Quantum versions of energy-based models</li>
                <li><strong className="text-purple-400">Quantum Generative Models:</strong> Create new data samples with quantum advantages</li>
                <li><strong className="text-purple-400">Quantum Transfer Learning:</strong> Combine pre-trained classical models with quantum components</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-medium text-green-400 mb-2">Applications in Lottery Analysis</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>Identifying subtle temporal patterns in drawing sequences</li>
                <li>Detecting complex correlations between different lottery numbers</li>
                <li>Generating optimized number combinations based on historical data</li>
                <li>Quantifying uncertainty in predictions with quantum probability distributions</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>This component provides simplified explanations of quantum algorithms for educational purposes.
          While these algorithms have theoretical advantages, they cannot predict truly random events like lottery draws.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumAlgorithmExplainer;