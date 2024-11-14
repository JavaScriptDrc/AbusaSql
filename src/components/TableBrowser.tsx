import React from 'react';
import { Table, ChevronRight, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchTables, fetchTableData } from '../lib/api';
import { ResultsTable } from './ResultsTable';

export function TableBrowser() {
  const [tables, setTables] = React.useState<Array<{ name: string }>>([]);
  const [selectedTable, setSelectedTable] = React.useState<string | null>(null);
  const [tableData, setTableData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchTables();
      if (result.success) {
        setTables(result.data.map((row: any) => ({
          name: Object.values(row)[0] as string
        })));
      } else {
        setError(result.error || 'Failed to load tables');
      }
    } catch (error) {
      setError('Unable to connect to the database server. Please ensure the server is running.');
      console.error('Failed to load tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchTableData(tableName);
      if (result.success) {
        const columns = Object.keys(result.data[0] || {});
        setTableData({
          columns,
          rows: result.data
        });
      } else {
        setError(result.error || 'Failed to load table data');
      }
    } catch (error) {
      setError('Unable to load table data. Please try again.');
      console.error('Failed to load table data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTables();
  }, []);

  React.useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable]);

  if (error) {
    return (
      <div className="h-full bg-gray-900 text-gray-100 p-4">
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadTables}
            className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Tables</h2>
        </div>
        <button
          onClick={loadTables}
          className="p-2 hover:bg-gray-800 rounded"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-[250px,1fr] gap-4">
        <div className="space-y-2">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => setSelectedTable(table.name)}
              className={`flex items-center gap-2 w-full p-2 rounded hover:bg-gray-800 transition-colors
                ${selectedTable === table.name ? 'bg-gray-800' : ''}`}
            >
              <Table className="w-4 h-4" />
              <span>{table.name}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : tableData ? (
            <ResultsTable results={tableData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a table to view its data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}