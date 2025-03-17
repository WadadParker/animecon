// db/db.ts
import { SQL } from "bun";

// Export the db instance so other modules can use it.
export let db: SQL;

// Function to initialize the DB connection.
export function initDB() {
  // Read the Postgres URL from the environment variables.
  const postgresUrl = Bun.env.POSTGRES_URL;
  if (!postgresUrl) {
    throw new Error("POSTGRES_URL environment variable is not set.");
  }
  db = new SQL(postgresUrl)
}
