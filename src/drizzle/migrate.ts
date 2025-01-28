import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./db";

const main = async () => {
  try {
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });

    console.log("Migration successful");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
