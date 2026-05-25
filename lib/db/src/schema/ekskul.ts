import { mysqlTable, text, boolean, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ekskulTable = mysqlTable("ekskul", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 200 }).notNull(),
  deskripsi: text("deskripsi"),
  gambar: text("gambar"),
  pembina: varchar("pembina", { length: 200 }),
  jadwal: varchar("jadwal", { length: 200 }),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertEkskulSchema = createInsertSchema(ekskulTable).omit({ id: true, created_at: true });
export type InsertEkskul = z.infer<typeof insertEkskulSchema>;
export type Ekskul = typeof ekskulTable.$inferSelect;
