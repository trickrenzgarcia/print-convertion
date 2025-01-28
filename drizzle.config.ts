import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/migrations/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "mysql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
