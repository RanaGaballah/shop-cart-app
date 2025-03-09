import { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config(); 

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",  
      password: process.env.DB_PASSWORD || "123",
      database: process.env.DB_NAME || "Cart_db",
      port: Number(process.env.DB_PORT) || 5432,
    },
    pool: {
      min: 2, 
      max: 20, 
      acquireTimeoutMillis: 60000, 
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
};

export default config;

