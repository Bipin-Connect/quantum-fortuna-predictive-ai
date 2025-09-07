/**
 * QuantumSettings.tsx
 * Component for configuring quantum prediction engine parameters
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { QuantumKernelParams } from '../types';

interface QuantumSettingsProps {
  onApplySettings: (params: QuantumKernelParams) => void;
  defaultParams?: QuantumKernelParams;
}

export const QuantumSettings: React.FC<QuantumSettingsProps> = ({ 
  onApplySettings,
  defaultParams
}) => {
  const [entanglementDepth, setEntanglementDepth] = useState<number>(defaultParams?.entanglementDepth || 3);
  const [shotCount, setShotCount] = useState<number>(defaultParams?.shotCount || 1024);
  const [featureMap, setFeatureMap] = useState<string>(defaultParams?.featureMap || 'ZZFeatureMap');
  const [optimizationLevel, setOptimizationLevel] = useState<number>(defaultParams?.optimizationLevel || 2);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  
  const handleApplySettings = () => {
    onApplySettings({
      entanglementDepth,
      shotCount,
      featureMap,
      optimizationLevel
    });
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Quantum Engine Settings</span>
          <div className="flex items-center space-x-2">
            <Label htmlFor="advanced-mode" className="text-sm text-gray-400">Advanced Mode</Label>
            <Switch 
              id="advanced-mode" 
              checked={advancedMode} 
              onCheckedChange={setAdvancedMode} 
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure the quantum prediction engine parameters
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="entanglement-depth" className="text-gray-300">Entanglement Depth</Label>
            <span className="text-gray-400">{entanglementDepth}</span>
          </div>
          <Slider
            id="entanglement-depth"
            min={1}
            max={5}
            step={1}
            value={[entanglementDepth]}
            onValueChange={(values) => setEntanglementDepth(values[0])}
            className="py-4"
          />
          <p className="text-xs text-gray-500">
            Controls the complexity of quantum circuit entanglement. Higher values may improve pattern detection but increase computational cost.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="shot-count" className="text-gray-300">Shot Count</Label>
            <span className="text-gray-400">{shotCount}</span>
          </div>
          <Slider
            id="shot-count"
            min={256}
            max={8192}
            step={256}
            value={[shotCount]}
            onValueChange={(values) => setShotCount(values[0])}
            className="py-4"
          />
          <p className="text-xs text-gray-500">
            Number of quantum circuit executions. Higher values reduce statistical noise but increase processing time.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="feature-map" className="text-gray-300">Feature Map</Label>
          <Select 
            value={featureMap} 
            onValueChange={setFeatureMap}
          >
            <SelectTrigger id="feature-map" className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select feature map" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="ZZFeatureMap">ZZ Feature Map</SelectItem>
              <SelectItem value="PauliFeatureMap">Pauli Feature Map</SelectItem>
              <SelectItem value="ZFeatureMap">Z Feature Map</SelectItem>
              {advancedMode && (
                <>
                  <SelectItem value="CustomFeatureMap">Custom Feature Map</SelectItem>
                  <SelectItem value="EnhancedZZFeatureMap">Enhanced ZZ Feature Map</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Determines how classical data is encoded into quantum states. Different maps capture different correlation patterns.
          </p>
        </div>
        
        {advancedMode && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="optimization-level" className="text-gray-300">Optimization Level</Label>
              <span className="text-gray-400">{optimizationLevel}</span>
            </div>
            <Slider
              id="optimization-level"
              min={0}
              max={3}
              step={1}
              value={[optimizationLevel]}
              onValueChange={(values) => setOptimizationLevel(values[0])}
              className="py-4"
            />
            <p className="text-xs text-gray-500">
              Controls the level of circuit optimization. Higher values produce more efficient circuits but may take longer to compile.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleApplySettings}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Apply Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuantumSettings;