/**
 * QuantumEntropyVisualizer.tsx
 * Component for visualizing quantum entropy and randomness
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sparkles, RefreshCw } from 'lucide-react';

interface QuantumEntropyVisualizerProps {
  width?: number;
  height?: number;
  particleCount?: number;
  quantumFactor?: number;
}

export const QuantumEntropyVisualizer: React.FC<QuantumEntropyVisualizerProps> = ({
  width = 400,
  height = 300,
  particleCount: initialParticleCount = 100,
  quantumFactor: initialQuantumFactor = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(initialParticleCount);
  const [quantumFactor, setQuantumFactor] = useState<number>(initialQuantumFactor);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);

  // Initialize particles
  const initParticles = () => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 260 + 180}, 80%, 60%)`,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.1,
        lastQuantumJump: 0
      });
    }
    particlesRef.current = particles;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(17, 24, 39, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Quantum effects based on quantumFactor
      const quantumProbability = quantumFactor / 1000;
      
      // Quantum tunneling/teleportation (rare random jumps)
      if (Math.random() < quantumProbability && Date.now() - particle.lastQuantumJump > 2000) {
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
        particle.lastQuantumJump = Date.now();
      }
      
      // Quantum uncertainty in velocity
      if (Math.random() < quantumProbability * 2) {
        particle.vx += (Math.random() - 0.5) * quantumFactor / 25;
        particle.vy += (Math.random() - 0.5) * quantumFactor / 25;
      }
      
      // Wave-particle duality effect
      const waveEffect = Math.sin(particle.phase) * (quantumFactor / 50);
      
      // Update position
      particle.x += particle.vx + waveEffect;
      particle.y += particle.vy;
      particle.phase += particle.phaseSpeed;
      
      // Boundary conditions
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Draw quantum entanglement lines (for nearby particles)
      if (quantumFactor > 30) {
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50 && distance > 0) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(138, 43, 226, ${(1 - distance / 50) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
    });

    // Continue animation
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Start/stop animation
  const toggleAnimation = () => {
    if (isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      initParticles();
      animationRef.current = requestAnimationFrame(animate);
    }
    setIsRunning(!isRunning);
  };

  // Reset animation with new parameters
  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    initParticles();
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initParticles();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Reset when parameters change
  useEffect(() => {
    resetAnimation();
  }, [particleCount, quantumFactor]);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
          Quantum Entropy Visualizer
        </CardTitle>
        <CardDescription className="text-gray-400">
          Visualize quantum-inspired randomness and entropy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border border-gray-700 rounded-lg bg-gray-950"
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Particle Count</label>
                <span className="text-sm text-gray-400">{particleCount}</span>
              </div>
              <Slider
                value={[particleCount]}
                min={10}
                max={300}
                step={10}
                onValueChange={(values) => setParticleCount(values[0])}
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Quantum Factor</label>
                <span className="text-sm text-gray-400">{quantumFactor}%</span>
              </div>
              <Slider
                value={[quantumFactor]}
                min={0}
                max={100}
                step={5}
                onValueChange={(values) => setQuantumFactor(values[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Classical</span>
                <span>Quantum</span>
              </div>
            </div>
            
            <Button 
              onClick={toggleAnimation} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>This visualization demonstrates quantum-inspired concepts like:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Quantum uncertainty (random movement)</li>
              <li>Quantum tunneling (occasional teleportation)</li>
              <li>Wave-particle duality (sinusoidal motion)</li>
              <li>Quantum entanglement (connecting lines)</li>
            </ul>
            <p className="mt-2">For educational purposes only. This is a simplified visualization and not an accurate quantum simulation.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumEntropyVisualizer;