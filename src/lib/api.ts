const API_BASE = 'http://localhost:3000/api';

export async function fetchTables() {
  const response = await fetch(`${API_BASE}/tables`);
  return response.json();
}

export async function fetchTableSchema(tableName: string) {
  const response = await fetch(`${API_BASE}/tables/${tableName}/schema`);
  return response.json();
}

export async function fetchTableData(tableName: string) {
  const response = await fetch(`${API_BASE}/tables/${tableName}/data`);
  return response.json();
}

export async function executeQuery(sql: string, params: unknown[] = []) {
  const response = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });
  return response.json();
}