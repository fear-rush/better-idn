// src/db/index.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { config } from "../config";

// Create a database connection
const client = postgres(config.DATABASE_URL || "");
const db = drizzle(client, { schema });

// Function to check database connection
export async function checkDBConnection() {
  try {
    await client`SELECT 1`; // Simple query to check connection
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to the database.");
  }
}

export { db };