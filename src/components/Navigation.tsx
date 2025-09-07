import React from 'react';
import { Zap, Target, BarChart3, Clock, Brain, Shield, User, AlertTriangle } from 'lucide-react';

type ActiveModule = 'welcome' | 'intake' | 'predictions' | 'schedule' | 'insights' | 'trust' | 'portal' | 'analysis' | 'september6' | 'quantum';

interface NavigationProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeModule, setActiveModule }) => {
  const navItems = [
    { id: 'quantum' as const, label: 'Quantum AI', icon: Zap },
    { id: 'september6' as const, label: 'Sep 6 Report', icon: AlertTriangle },
    { id: 'welcome' as const, label: 'Welcome', icon: Zap },
    { id: 'intake' as const, label: 'Intake', icon: Target },
    { id: 'predictions' as const, label: 'Predictions', icon: Brain },
    { id: 'schedule' as const, label: 'Schedule', icon: Clock },
    { id: 'insights' as const, label: 'Insights', icon: BarChart3 },
    { id: 'trust' as const, label: 'Trust', icon: Shield },
    { id: 'portal' as const, label: 'Portal', icon: User },
    { id: 'analysis' as const, label: 'Analysis', icon: Brain },
  ];

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Quantum Fortuna™ v5.3
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeModule === id
                    ? id === 'september6' 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : id === 'quantum'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;