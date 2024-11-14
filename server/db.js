import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'db_hostel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (err) {
    console.error('Erreur de connexion:', err);
  }
}

testConnection();

export async function executeQuery(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return {
      success: true,
      data: rows
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getTables() {
  return executeQuery('SHOW TABLES');
}

export async function getTableSchema(tableName) {
  const query = `DESCRIBE ${mysql.escapeId(tableName)}`;
  return executeQuery(query);
}

export async function getTableData(tableName, limit = 1000) {
  const query = `SELECT * FROM ${mysql.escapeId(tableName)} LIMIT ${mysql.escape(limit)}`;
  return executeQuery(query);
}