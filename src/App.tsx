import React from 'react';
import { Layout, Database, Code2, TableProperties } from 'lucide-react';
import { TableBrowser } from './components/TableBrowser';
import { QueryEditor } from './components/QueryEditor';
import { SchemaEditor } from './components/SchemaEditor';

function App() {
  const [activeTab, setActiveTab] = React.useState<'browse' | 'query' | 'schema'>('browse');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Layout className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold"> AbusaSQL LocalDB Manager</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
              ${activeTab === 'browse' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <Database className="w-4 h-4" />
            Browse
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
              ${activeTab === 'query' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <Code2 className="w-4 h-4" />
            Query
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
              ${activeTab === 'schema' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <TableProperties className="w-4 h-4" />
            Schema
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl min-h-[600px]">
          {activeTab === 'browse' && <TableBrowser />}
          {activeTab === 'query' && <QueryEditor />}
          {activeTab === 'schema' && <SchemaEditor />}
        </div>
      </div>
    </div>
  );
}

export default App;