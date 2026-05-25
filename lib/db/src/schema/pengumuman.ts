import { mysqlTable, text, boolean, serial, timestamp, int } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pengumumanTable = mysqlTable("pengumuman", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  konten: text("konten").notNull(),
  prioritas: int("prioritas").notNull().default(0),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertPengumumanSchema = createInsertSchema(pengumumanTable).omit({ id: true, created_at: true });
export type InsertPengumuman = z.infer<typeof insertPengumumanSchema>;
export type Pengumuman = typeof pengumumanTable.$inferSelect;
