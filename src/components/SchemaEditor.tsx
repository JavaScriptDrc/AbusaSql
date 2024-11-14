import React from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { localDB } from '../lib/db';

export function SchemaEditor() {
  const [tableName, setTableName] = React.useState('');
  const [columns, setColumns] = React.useState<Array<{
    name: string;
    type: string;
    nullable: boolean;
    primary: boolean;
  }>>([]);

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'VARCHAR', nullable: true, primary: false }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const saveTable = async () => {
    try {
      await localDB.createTable(tableName, columns);
      setTableName('');
      setColumns([]);
    } catch (error) {
      console.error('Failed to create table:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100">
      <h2 className="text-xl font-semibold mb-6">Create New Table</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Table Name</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Columns</h3>
            <button
              onClick={addColumn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Column
            </button>
          </div>
          
          <div className="space-y-4">
            {columns.map((column, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) => {
                    const newColumns = [...columns];
                    newColumns[index] = { ...column, name: e.target.value };
                    setColumns(newColumns);
                  }}
                  placeholder="Column name"
                  className="flex-1 px-4 py-2 bg-gray-800 rounded"
                />
                <select
                  value={column.type}
                  onChange={(e) => {
                    const newColumns = [...columns];
                    newColumns[index] = { ...column, type: e.target.value };
                    setColumns(newColumns);
                  }}
                  className="px-4 py-2 bg-gray-800 rounded"
                >
                  <option value="VARCHAR">VARCHAR</option>
                  <option value="INTEGER">INTEGER</option>
                  <option value="DATETIME">DATETIME</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                </select>
                <button
                  onClick={() => removeColumn(index)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveTable}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Table
        </button>
      </div>
    </div>
  );
}