import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SQLResult } from './sqlParser';

interface LocalDBSchema extends DBSchema {
  tables: {
    key: string;
    value: {
      name: string;
      schema: Array<{
        name: string;
        type: string;
        nullable: boolean;
        primary: boolean;
      }>;
      data: Array<Record<string, any>>;
    };
  };
  queries: {
    key: string;
    value: {
      sql: string;
      timestamp: number;
      results: SQLResult;
    };
  };
}

class LocalDB {
  private db: IDBPDatabase<LocalDBSchema> | null = null;

  async init() {
    this.db = await openDB<LocalDBSchema>('localdb', 1, {
      upgrade(db) {
        db.createObjectStore('tables');
        db.createObjectStore('queries');
      },
    });
    return this;
  }

  async createTable(name: string, schema: Array<{ name: string; type: string; nullable: boolean; primary: boolean }>) {
    if (!this.db) await this.init();
    await this.db!.put('tables', { name, schema, data: [] }, name);
  }

  async getTables() {
    if (!this.db) await this.init();
    return await this.db!.getAll('tables');
  }

  async getTable(name: string) {
    if (!this.db) await this.init();
    return await this.db!.get('tables', name);
  }

  async executeQuery(sql: string) {
    if (!this.db) await this.init();
    const timestamp = Date.now();
    const results = { columns: [], rows: [] };
    
    await this.db!.put('queries', {
      sql,
      timestamp,
      results
    }, timestamp.toString());
    
    return results;
  }

  async getQueryHistory(limit = 10) {
    if (!this.db) await this.init();
    const all = await this.db!.getAll('queries');
    return all
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

export const localDB = new LocalDB();