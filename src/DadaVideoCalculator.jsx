import React, { useState } from 'react';

export default function DadaVideoCalculator() {
  const [currentRoll, setCurrentRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [rollMode, setRollMode] = useState('integer'); // 'integer' or 'float'

  const rollDice = () => {
    setIsRolling(true);
    
    // Simulate rolling animation with random numbers
    let count = 0;
    const interval = setInterval(() => {
      if (rollMode === 'float') {
        setCurrentRoll((Math.random() * 10).toFixed(2));
      } else {
        setCurrentRoll(Math.floor(Math.random() * 10) + 1);
      }
      count++;
      
      if (count >= 15) {
        clearInterval(interval);
        const finalRoll = rollMode === 'float' 
          ? parseFloat((Math.random() * 10).toFixed(2))
          : Math.floor(Math.random() * 10) + 1;
        setCurrentRoll(finalRoll);
        setRollHistory(prev => [{ value: finalRoll, mode: rollMode }, ...prev].slice(0, 10));
        setIsRolling(false);
      }
    }, 50);
  };

  const clearHistory = () => {
    setRollHistory([]);
    setCurrentRoll(null);
  };

  const getColorClass = (number) => {
    const num = typeof number === 'string' ? parseFloat(number) : number;
    if (num >= 9.5) return 'from-amber-400 to-yellow-500';
    if (num >= 8) return 'from-emerald-400 to-green-500';
    if (num >= 5) return 'from-blue-400 to-cyan-500';
    return 'from-slate-400 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">D10 Dice Roller</h1>
          <p className="text-gray-300">Roll your 10-sided dice</p>
          
          {/* Mode Selector */}
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setRollMode('integer')}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all
                ${rollMode === 'integer' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }
              `}
            >
              Integer (1-10)
            </button>
            <button
              onClick={() => setRollMode('float')}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all
                ${rollMode === 'float' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }
              `}
            >
              Float (0.00-10.00)
            </button>
          </div>
        </div>

        {/* Dice Display */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-6 flex flex-col items-center justify-center">
          <div 
            className={`
              w-64 h-64 rounded-3xl shadow-xl flex items-center justify-center
              transform transition-all duration-300
              ${isRolling ? 'animate-bounce scale-95' : 'scale-100'}
              bg-gradient-to-br ${currentRoll ? getColorClass(currentRoll) : 'from-slate-200 to-gray-300'}
            `}
          >
            <span className={`
              text-9xl font-bold text-white drop-shadow-lg
              ${isRolling ? 'blur-sm' : 'blur-0'}
              transition-all duration-200
            `}>
              {currentRoll !== null ? (rollMode === 'float' ? parseFloat(currentRoll).toFixed(2) : currentRoll) : '?'}
            </span>
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling}
            className={`
              mt-8 px-12 py-4 rounded-xl font-bold text-lg text-white
              transition-all duration-200 transform
              ${isRolling 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 hover:scale-105 active:scale-95'
              }
            `}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Roll History</h2>
              <button
                onClick={clearHistory}
                className="text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Clear
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {rollHistory.map((roll, index) => (
                <div
                  key={index}
                  className={`
                    ${roll.mode === 'float' ? 'w-20' : 'w-14'} h-14 rounded-lg flex items-center justify-center
                    ${roll.mode === 'float' ? 'text-lg' : 'text-2xl'} font-bold text-white shadow-md
                    bg-gradient-to-br ${getColorClass(roll.value)}
                  `}
                >
                  {roll.mode === 'float' ? parseFloat(roll.value).toFixed(2) : roll.value}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Average:</span>{' '}
                {(rollHistory.reduce((a, b) => a + parseFloat(b.value), 0) / rollHistory.length).toFixed(2)}
                <span className="ml-4 font-semibold">Total Rolls:</span> {rollHistory.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
