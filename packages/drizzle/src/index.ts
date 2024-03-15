import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString) throw Error("Connection string not found!");

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false, ssl: "prefer" });
export const db = drizzle(client, { schema });
