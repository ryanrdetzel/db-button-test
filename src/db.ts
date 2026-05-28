import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add `database: { provider: \"neon\" }` to .deploymill/project.json and run reconcile_project."
  );
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params as any[]);
}
