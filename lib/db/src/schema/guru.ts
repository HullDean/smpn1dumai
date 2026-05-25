import { mysqlTable, text, boolean, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guruTable = mysqlTable("guru", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 300 }).notNull(),
  nip: varchar("nip", { length: 50 }),
  mata_pelajaran: varchar("mata_pelajaran", { length: 200 }).notNull(),
  jabatan: varchar("jabatan", { length: 200 }).notNull().default("Guru"),
  foto: text("foto"),
  bio: text("bio"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertGuruSchema = createInsertSchema(guruTable).omit({ id: true, created_at: true });
export type InsertGuru = z.infer<typeof insertGuruSchema>;
export type Guru = typeof guruTable.$inferSelect;
