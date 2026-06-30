import type { Config } from "drizzle-kit";

// Charge .env.local pour l'outillage (Next charge déjà ces vars dans l'app)
try {
  process.loadEnvFile?.(".env.local");
} catch {}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL!,
  },
} satisfies Config;
