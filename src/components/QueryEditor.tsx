import React from 'react';
import { Play,Save, History, X } from 'lucide-react';
import { executeQuery } from '../lib/api';
import { ResultsTable } from './ResultsTable';
import type { SQLResult } from '../lib/sqlParser';

export function QueryEditor() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SQLResult | null>(null);
  const [history, setHistory] = React.useState<string[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const runQuery = async () => {
    try {
      setLoading(true);
      const result = await executeQuery(query);
      if (result.success) {
        const columns = Object.keys(result.data[0] || {});
        setResults({
          columns,
          rows: result.data
        });
        setHistory(prev => [query, ...prev].slice(0, 10));
      } else {
        setResults({
          columns: ['Error'],
          rows: [{ Error: result.error }],
          error: result.error
        });
      }
    } catch (error) {
      console.error('Query execution failed:', error);
      setResults({
        columns: ['Error'],
        rows: [{ Error: 'Failed to execute query' }],
        error: 'Failed to execute query'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      runQuery();
    }
  };

  const saveQuery = () => {
    const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
    if (!savedQueries.includes(query)) {
      localStorage.setItem('savedQueries', JSON.stringify([...savedQueries, query]));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-2 mb-4">
          <button
            onClick={runQuery}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Run
          </button>
          <button
            onClick={saveQuery}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-40 p-4 bg-gray-800 text-gray-100 font-mono rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your SQL query here... (Ctrl/Cmd + Enter to execute)"
          />

          {showHistory && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-10">
              <div className="flex items-center justify-between p-2 border-b border-gray-700">
                <h3 className="text-sm font-medium">Query History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {history.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(q);
                      setShowHistory(false);
                    }}
                    className="w-full p-2 text-left hover:bg-gray-700 text-sm font-mono truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {results && (
        <div className="flex-1 overflow-auto p-4">
          <ResultsTable results={results} />
        </div>
      )}
    </div>
  );
}