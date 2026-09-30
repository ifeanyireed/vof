import { neon } from '@neondatabase/serverless';

const connStr =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_LouPIU72xaSO@ep-broad-moon-b5bq0zrt-pooler.c-7.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const rawSql = neon(connStr);

export interface SqlTagFunction {
  <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]>;
  <T = any>(query: string, params?: any[]): Promise<T[]>;
  query<T = any>(query: string, params?: any[]): Promise<T[]>;
}

export const sql = rawSql as unknown as SqlTagFunction;
