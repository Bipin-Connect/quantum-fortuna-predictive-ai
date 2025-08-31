import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle, FileText, Database } from 'lucide-react';

const ScheduleModule: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRegistry, setShowRegistry] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Complete draw schedule registry
  const draws = [
    {
      name: 'Emirates Draw MEGA7',
      nextDraw: new Date('2025-09-01T20:00:00'),
      frequency: 'Weekly',
      status: 'upcoming'
    },
    {
      name: 'Emirates Draw EASY6',
      nextDraw: new Date('2025-09-01T19:30:00'),
      frequency: 'Bi-weekly',
      status: 'upcoming'
    },
    {
      name: 'Emirates Draw FAST5',
      nextDraw: new Date('2025-09-01T18:00:00'),
      frequency: 'Daily',
      status: 'active'
    },
    {
      name: 'Omillionaire',
      nextDraw: new Date('2025-09-01T21:00:00'),
      frequency: 'Weekly',
      status: 'upcoming'
    },
    {
      name: 'Lotto India',
      nextDraw: new Date('2025-09-01T21:00:00'),
      frequency: 'Daily',
      status: 'active'
    },
    {
      name: 'EuroMillions',
      nextDraw: new Date('2025-09-01T21:00:00'),
      frequency: 'Bi-weekly',
      status: 'upcoming'
    },
    {
      name: 'Lottery.co.uk Free',
      nextDraw: new Date('2025-09-01T12:00:00'),
      frequency: 'Daily',
      status: 'active'
    },
    {
      name: 'Powerball USA',
      nextDraw: new Date('2025-09-01T23:00:00'),
      frequency: 'Bi-weekly',
      status: 'upcoming'
    }
  ];

  const getTimeRemaining = (targetDate: Date) => {
    const now = currentTime.getTime();
    const target = targetDate.getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { expired: true, timeString: 'Draw Completed' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let timeString = '';
    if (days > 0) timeString += `${days}d `;
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    timeString += `${seconds}s`;

    return { expired: false, timeString };
  };

  const getStatusColor = (status: string, expired: boolean) => {
    if (expired) return 'text-red-400';
    if (status === 'active') return 'text-green-400';
    return 'text-yellow-400';
  };

  const getStatusBadge = (status: string, expired: boolean) => {
    if (expired) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (status === 'active') return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const toggleRegistry = () => {
    setShowRegistry(!showRegistry);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Draw Schedule</h1>
        <p className="text-gray-300">Real-time countdown timers with complete draw schedule registry</p>
        
        <div className="mt-4 flex justify-center space-x-4">
          <button 
            onClick={toggleRegistry}
            className="flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
          >
            <FileText className="w-4 h-4 mr-2" />
            {showRegistry ? 'Hide Complete Registry' : 'Show Complete Registry'}
          </button>
        </div>
      </div>
      
      {showRegistry && (
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Complete Draw Schedule Registry</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-800/70 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Lottery</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3">Draw Days</th>
                  <th className="px-4 py-3">Draw Time (UTC)</th>
                  <th className="px-4 py-3">Next Draw</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {draws.map((draw, index) => {
                  const { expired } = getTimeRemaining(draw.nextDraw);
                  return (
                    <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="px-4 py-3 font-medium">{draw.name}</td>
                      <td className="px-4 py-3">{draw.frequency}</td>
                      <td className="px-4 py-3">{draw.frequency === 'Weekly' ? 'Monday' : draw.frequency === 'Bi-weekly' ? 'Monday, Thursday' : 'Every day'}</td>
                      <td className="px-4 py-3">{draw.nextDraw.toTimeString().substring(0, 5)}</td>
                      <td className="px-4 py-3">{draw.nextDraw.toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(draw.status, expired)}`}>
                          {expired ? 'Completed' : draw.status === 'active' ? 'Active' : 'Upcoming'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draws.map((draw, index) => {
          const { expired, timeString } = getTimeRemaining(draw.nextDraw);
          return (
            <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{draw.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(draw.status, expired)}`}>
                  {expired ? 'Completed' : draw.status === 'active' ? 'Active' : 'Upcoming'}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">{draw.nextDraw.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center mb-6">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">{draw.nextDraw.toTimeString().substring(0, 5)} UTC</span>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Time Remaining</p>
                <p className={`text-2xl font-bold ${getStatusColor(draw.status, expired)}`}>
                  {timeString}
                </p>
              </div>
              
              {expired && (
                <div className="mt-4 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                    <p className="text-sm text-red-400">Draw completed. Results available in Analysis.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleModule;