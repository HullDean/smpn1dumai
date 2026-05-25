import { mysqlTable, text, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const prestasiTable = mysqlTable("prestasi", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  tanggal: varchar("tanggal", { length: 20 }).notNull(),
  tingkat: varchar("tingkat", { length: 50 }).notNull().default("Kota"),
  kategori: varchar("kategori", { length: 100 }).notNull().default("Akademik"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertPrestasiSchema = createInsertSchema(prestasiTable).omit({ id: true, created_at: true });
export type InsertPrestasi = z.infer<typeof insertPrestasiSchema>;
export type Prestasi = typeof prestasiTable.$inferSelect;
