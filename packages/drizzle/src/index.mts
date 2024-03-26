import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString)
	throw Error("Connection string not found!", {
		cause: "Didn't load env variabels",
	});

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false, ssl: "prefer" });
export const db = drizzle(client, { schema });

export type PgTx = PgTransaction<
	PostgresJsQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;
