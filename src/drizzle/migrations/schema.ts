import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int().autoincrement().notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull(),
});
