import React, { useState } from 'react';

export default function DadaVideoCalculator() {
  const [poemText, setPoemText] = useState('');
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(8);
  const [results, setResults] = useState([]);

  const countSyllables = (word) => {
    word = word.toLowerCase().trim();
    if (word.length === 0) return 0;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const calculateDurations = () => {
    const lines = poemText.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      setResults([]);
      return;
    }

    const linesWithSyllables = lines.map(line => {
      const words = line.trim().split(/\s+/);
      const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);
      return { text: line, syllables: syllableCount };
    });

    const maxSyl = Math.max(...linesWithSyllables.map(l => l.syllables));
    const minSyl = Math.min(...linesWithSyllables.map(l => l.syllables));

    const calculated = linesWithSyllables.map((line, index) => {
      let duration;
      if (maxSyl === minSyl) {
        duration = maxDuration;
      } else {
        duration = minDuration + 
          ((line.syllables - minSyl) / (maxSyl - minSyl)) * 
          (maxDuration - minDuration);
      }
      
      return {
        lineNumber: index + 1,
        text: line.text,
        syllables: line.syllables,
        duration: duration.toFixed(2)
      };
    });

    setResults(calculated);
  };

  const totalDuration = results.reduce((sum, r) => sum + parseFloat(r.duration), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            
            <h1 className="text-3xl font-bold text-gray-900">Duration Calculator</h1>
          </div>
          <p className="text-gray-600">Calculate video clip lengths based on syllable count for our Computational DADA paper</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste the poem here (one line at a time)
          </label>
          <textarea
            value={poemText}
            onChange={(e) => setPoemText(e.target.value)}
            placeholder="the first line &#10;and then the second line of the poem&#10;third and so on"
            className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono text-sm"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Duration (seconds)
              </label>
              <input
                type="number"
                value={minDuration}
                onChange={(e) => setMinDuration(parseFloat(e.target.value))}
                min="0.1"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Duration (seconds)
              </label>
              <input
                type="number"
                value={maxDuration}
                onChange={(e) => setMaxDuration(parseFloat(e.target.value))}
                min="0.1"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <button
            onClick={calculateDurations}
            className="w-full mt-4 bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Calculate Durations
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
            
            <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Total composition duration:</span> {totalDuration.toFixed(2)} seconds
              </p>
            </div>

            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.lineNumber} className="border border-gray-200 rounded-lg p-4 hover:border-slate-400 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      Line {result.lineNumber}
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                      {result.duration}s
                    </span>
                  </div>
                  <p className="text-gray-700 font-mono text-sm mb-2">{result.text}</p>
                  <p className="text-xs text-gray-500">{result.syllables} syllables</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
