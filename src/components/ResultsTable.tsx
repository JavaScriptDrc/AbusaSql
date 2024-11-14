import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SQLResult } from '../lib/sqlParser';

interface ResultsTableProps {
  results: SQLResult;
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  if (results.error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
        <p className="text-red-400">{results.error}</p>
      </div>
    );
  }

  const startIdx = page * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = results.rows.slice(startIdx, endIdx);
  const totalPages = Math.ceil(results.rows.length / rowsPerPage);

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {results.columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {currentRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-800/50">
                {results.columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm">
                    {row[column]?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}