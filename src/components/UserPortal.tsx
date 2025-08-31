import React, { useState } from 'react';
import { User, Download, Webhook, Settings, Bell } from 'lucide-react';

const UserPortal: React.FC = () => {
  const [zapierUrl, setZapierUrl] = useState('');
  const [notifications, setNotifications] = useState({
    predictions: true,
    draws: true,
    updates: false
  });

  const handleExportCSV = () => {
    const csvData = [
      ['Lottery', 'Predictions', 'Confidence', 'Date'],
      ['Emirates Draw MEGA7', '7,14,21,28,35,42,49', '99.3%', '2025-09-01'],
  ['Emirates Draw EASY6', '4,11,18,25,32,39', '98.1%', '2025-09-01'],
  ['Emirates Draw FAST5', '9,17,25,33,41', '96.8%', '2025-09-01'],
  ['Omillionaire', '8,15,22,29,36,43,50', '98.7%', '2025-09-01'],
  ['Lotto India', '9,18,27,36,45,54', '98.1%', '2025-09-01'],
  ['Powerball USA', '12,24,36,48,60 + PB:15', '96.5%', '2025-09-01'],
  ['EuroMillions', '8,16,24,32,40 + LS:4,11', '97.9%', '2025-09-01'],
  ['Lottery.co.uk Free', '6,12,18,24,30,36', '95.8%', '2025-09-01'],
  ['UK Free Lottery Weekly', '5,11,17,23,29,35', '96.4%', '2025-09-01']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'quantum_fortuna_predictions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleZapierSetup = () => {
    if (zapierUrl.trim()) {
      alert('Zapier webhook configured successfully! You will receive notifications for prediction updates.');
      setZapierUrl('');
    }
  };

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">User Portal</h1>
        <p className="text-gray-300">Export data, configure notifications, and manage settings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <Download className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Data Export</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-2">Prediction Data</h3>
              <p className="text-gray-400 text-sm mb-4">
                Export current predictions with confidence scores and metadata
              </p>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-2">Historical Analysis</h3>
              <p className="text-gray-400 text-sm mb-4">
                Complete historical data and performance metrics
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <Webhook className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Zapier Integration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="zapier-url" className="block text-white font-medium mb-2">
                Webhook URL
              </label>
              <input
                id="zapier-url"
                type="url"
                value={zapierUrl}
                onChange={(e) => setZapierUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleZapierSetup}
              disabled={!zapierUrl.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Configure Webhook
            </button>

            <div className="text-sm text-gray-400">
              <p className="mb-2">Webhook will trigger on:</p>
              <ul className="space-y-1 pl-4">
                <li>• New prediction updates</li>
                <li>• Draw result notifications</li>
                <li>• System status changes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(notifications).map(([key, enabled]) => (
              <div key={key} className="bg-black/30 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium capitalize">
                    {key === 'predictions' ? 'New Predictions' : 
                     key === 'draws' ? 'Draw Results' : 'System Updates'}
                  </h3>
                  <button
                    onClick={() => toggleNotification(key as keyof typeof notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      enabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  {key === 'predictions' ? 'Get notified when new predictions are available' :
                   key === 'draws' ? 'Receive draw results and analysis updates' :
                   'System maintenance and feature updates'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Account Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Timezone</label>
                <select className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors">
                  <option value="IST">Indian Standard Time (IST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="EST">Eastern Standard Time (EST)</option>
                  <option value="PST">Pacific Standard Time (PST)</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Currency</label>
                <select className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Language</label>
                <select className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Theme</label>
                <select className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors">
                  <option value="quantum">Quantum (Default)</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;