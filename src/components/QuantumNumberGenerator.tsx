/**
 * QuantumNumberGenerator.tsx
 * Component for generating quantum-inspired random lottery numbers
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Sparkles, RefreshCw, Cpu } from 'lucide-react';

interface LotteryFormat {
  id: string;
  name: string;
  mainNumbers: number;
  mainRange: number;
  bonusNumbers?: number;
  bonusRange?: number;
}

interface QuantumNumberGeneratorProps {
  onNumbersGenerated?: (numbers: number[], bonusNumbers?: number[]) => void;
}

export const QuantumNumberGenerator: React.FC<QuantumNumberGeneratorProps> = ({ 
  onNumbersGenerated 
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('powerball');
  const [quantumEntanglement, setQuantumEntanglement] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedNumbers, setGeneratedNumbers] = useState<{main: number[], bonus?: number[]}>({ main: [] });
  
  const lotteryFormats: LotteryFormat[] = [
    { id: 'powerball', name: 'Powerball', mainNumbers: 5, mainRange: 69, bonusNumbers: 1, bonusRange: 26 },
    { id: 'mega_millions', name: 'Mega Millions', mainNumbers: 5, mainRange: 70, bonusNumbers: 1, bonusRange: 25 },
    { id: 'euromillions', name: 'EuroMillions', mainNumbers: 5, mainRange: 50, bonusNumbers: 2, bonusRange: 12 },
    { id: 'uk_lotto', name: 'UK Lotto', mainNumbers: 6, mainRange: 59 },
    { id: 'emirates_mega7', name: 'Emirates Mega 7', mainNumbers: 7, mainRange: 49 }
  ];
  
  const getCurrentFormat = (): LotteryFormat => {
    return lotteryFormats.find(format => format.id === selectedFormat) || lotteryFormats[0];
  };
  
  const generateQuantumNumbers = () => {
    setIsGenerating(true);
    
    // Simulate quantum-inspired number generation with timeout
    setTimeout(() => {
      const format = getCurrentFormat();
      
      // Generate main numbers
      const main: number[] = [];
      while (main.length < format.mainNumbers) {
        const num = Math.floor(Math.random() * format.mainRange) + 1;
        if (!main.includes(num)) {
          main.push(num);
        }
      }
      main.sort((a, b) => a - b);
      
      // Generate bonus numbers if needed
      let bonus: number[] | undefined;
      if (format.bonusNumbers && format.bonusRange) {
        bonus = [];
        while (bonus.length < format.bonusNumbers) {
          const num = Math.floor(Math.random() * format.bonusRange) + 1;
          if (!bonus.includes(num)) {
            bonus.push(num);
          }
        }
        bonus.sort((a, b) => a - b);
      }
      
      setGeneratedNumbers({ main, bonus });
      setIsGenerating(false);
      
      if (onNumbersGenerated) {
        onNumbersGenerated(main, bonus);
      }
    }, 1500);
  };
  
  const getNumberBallClass = (isBonus: boolean = false) => {
    return `w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${isBonus ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`;
  };
  
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-purple-400" />
          Quantum Number Generator
        </CardTitle>
        <CardDescription className="text-gray-400">
          Generate quantum-inspired random lottery numbers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Lottery Format</label>
            <Select 
              value={selectedFormat} 
              onValueChange={setSelectedFormat}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Select lottery format" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {lotteryFormats.map(format => (
                  <SelectItem key={format.id} value={format.id} className="text-gray-200">
                    {format.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-gray-400">Quantum Entanglement</label>
              <span className="text-sm text-gray-400">{quantumEntanglement}%</span>
            </div>
            <Slider
              value={[quantumEntanglement]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setQuantumEntanglement(values[0])}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Classical</span>
              <span>Balanced</span>
              <span>Quantum</span>
            </div>
          </div>
          
          <Button 
            onClick={generateQuantumNumbers} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quantum Numbers
              </>
            )}
          </Button>
          
          {generatedNumbers.main.length > 0 && (
            <div className="pt-4">
              <div className="text-sm text-gray-400 mb-2">Generated Numbers:</div>
              <div className="flex flex-wrap gap-2">
                {generatedNumbers.main.map((num, i) => (
                  <div key={`main-${i}`} className={getNumberBallClass()}>
                    {num}
                  </div>
                ))}
                
                {generatedNumbers.bonus && generatedNumbers.bonus.map((num, i) => (
                  <div key={`bonus-${i}`} className={getNumberBallClass(true)}>
                    {num}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>These numbers were generated using quantum-inspired randomness algorithms. For educational purposes only.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumNumberGenerator;