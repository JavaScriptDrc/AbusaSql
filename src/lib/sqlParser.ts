export type SQLResult = {
  columns: string[];
  rows: any[];
  error?: string;
};

export function parseSQL(sql: string): SQLResult {
  const normalizedSQL = sql.trim().toLowerCase();
  
  try {
    if (normalizedSQL.startsWith('select')) {
      return parseSelect(sql);
    } else if (normalizedSQL.startsWith('insert')) {
      return parseInsert(sql);
    } else if (normalizedSQL.startsWith('update')) {
      return parseUpdate(sql);
    } else if (normalizedSQL.startsWith('delete')) {
      return parseDelete(sql);
    }
    
    return {
      columns: [],
      rows: [],
      error: 'Unsupported SQL operation'
    };
  } catch (error) {
    return {
      columns: [],
      rows: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function parseSelect(sql: string): SQLResult {
  // Simple SELECT parser for demonstration
  return {
    columns: ['id', 'name', 'created_at'],
    rows: [
      { id: 1, name: 'Sample Row 1', created_at: new Date().toISOString() },
      { id: 2, name: 'Sample Row 2', created_at: new Date().toISOString() }
    ]
  };
}

function parseInsert(sql: string): SQLResult {
  return {
    columns: ['affected_rows'],
    rows: [{ affected_rows: 1 }]
  };
}

function parseUpdate(sql: string): SQLResult {
  return {
    columns: ['affected_rows'],
    rows: [{ affected_rows: 1 }]
  };
}

function parseDelete(sql: string): SQLResult {
  return {
    columns: ['affected_rows'],
    rows: [{ affected_rows: 1 }]
  };
}