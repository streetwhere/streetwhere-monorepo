import type { Config } from "drizzle-kit";

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString) throw Error("Connection string not found");

export default {
	schema: "./src/schema.ts",
	driver: "pg",
	dbCredentials: {
		connectionString,
		ssl: true,
	},
	tablesFilter: ["streetwhere_*"],
} satisfies Config;
