import express from 'express';
import { executeQuery, getTables, getTableSchema, getTableData } from './db.js';

const app = express();
app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Get all tables
app.get('/api/tables', async (req, res) => {
  const result = await getTables();
  res.json(result);
});

// Get table schema
app.get('/api/tables/:name/schema', async (req, res) => {
  console.log('Table demandée:', req.params.name);
  const result = await getTableSchema(req.params.name);
  console.log('Résultat:', result);
  res.json(result);
});

// Get table data
app.get('/api/tables/:name/data', async (req, res) => {
  const result = await getTableData(req.params.name);
  res.json(result);
});

// Execute custom query
app.post('/api/query', async (req, res) => {
  const { sql, params } = req.body;
  const result = await executeQuery(sql, params);
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});