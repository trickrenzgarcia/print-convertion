import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/migrations/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "mysql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: "mysql://u943563710_emsprintconv:uCDO5Zu$@auth-db1237.hstgr.io:3306/u943563710_emsprintconv",
  },
});
