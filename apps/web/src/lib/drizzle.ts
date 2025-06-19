import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Create the postgres client
const client = postgres(process.env.DATABASE_URL!, { 
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the Drizzle database instance
export const db = drizzle(client);