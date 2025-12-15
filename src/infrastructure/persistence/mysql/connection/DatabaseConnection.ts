import mysql from 'mysql2/promise';
import { singleton } from 'tsyringe';

@singleton()
export class DatabaseConnection {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'newsletters_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query<T>(sql: string, params?: any[]): Promise<T> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T;
  }

  async execute(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
    const [result] = await this.pool.execute(sql, params);
    return result as mysql.ResultSetHeader;
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    return this.pool.getConnection();
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
