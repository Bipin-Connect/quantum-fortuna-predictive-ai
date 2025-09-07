import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Navigation from './components/Navigation';
import WelcomeModule from './components/WelcomeModule';
import IntakeModule from './components/IntakeModule';
import PredictionsModule from './components/PredictionsModule';
import ScheduleModule from './components/ScheduleModule';
import InsightsModule from './components/InsightsModule';
import TrustModule from './components/TrustModule';
import UserPortal from './components/UserPortal';
import AnalysisModule from './components/AnalysisModule';
import September6Dashboard from './components/September6Dashboard';
import QuantumDashboard from './components/QuantumDashboard';

type ActiveModule =
  | 'welcome'
  | 'intake'
  | 'predictions'
  | 'schedule'
  | 'insights'
  | 'trust'
  | 'portal'
  | 'analysis'
  | 'september6'
  | 'quantum';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('quantum');
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([
    'emirates_mega7',
    'emirates_easy6',
    'emirates_fast5',
    'omillionaire',
    'lotto_india',
    'lotto_uk',
    'powerball_usa',
    'euromillions',
    'mega_millions',
    'oz_lotto',
    'canada_lotto',
    'super_lotto',
    'lotto_max',
    'saturday_lotto',
    'irish_lotto',
    'france_loto',
    'spanish_lotto',
    'lottery_co_uk',
    'uk_free_lottery',
  ]);

  return (
    <ErrorBoundary fallback={<div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
      <p className="text-gray-300">The application encountered an error. Please refresh the page or contact support.</p>
    </div>}>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950 pointer-events-none"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Navigation */}
        <Navigation activeModule={activeModule} setActiveModule={setActiveModule} />
        
        {/* Main content */}
        <main className="relative pt-16 pb-24">
          {activeModule === 'welcome' && <WelcomeModule />}
          {activeModule === 'intake' && (
            <IntakeModule
              selectedLotteries={selectedLotteries}
              setSelectedLotteries={setSelectedLotteries}
            />
          )}
          {activeModule === 'predictions' && (
            <PredictionsModule selectedLotteries={selectedLotteries} />
          )}
          {activeModule === 'schedule' && <ScheduleModule />}
          {activeModule === 'insights' && <InsightsModule />}
          {activeModule === 'trust' && <TrustModule />}
          {activeModule === 'portal' && <UserPortal />}
          {activeModule === 'analysis' && <AnalysisModule />}
          {activeModule === 'september6' && <September6Dashboard />}
          {activeModule === 'quantum' && <QuantumDashboard selectedLotteries={selectedLotteries} />}
        </main>
        
        {/* Footer */}
        <footer className="relative border-t border-gray-800 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                Quantum-Fortuna AI Dashboard © {new Date().getFullYear()} | Educational Purpose Only
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">Documentation</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">About</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
