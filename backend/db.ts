import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

/* export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); */

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "YOUR_PASSWORD",
  database: process.env.DB_NAME || "filmovi",
  port: Number(process.env.DB_PORT) || 5432,
});
