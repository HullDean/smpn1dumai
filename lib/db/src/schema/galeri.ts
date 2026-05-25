import { mysqlTable, text, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galeriTable = mysqlTable("galeri", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 300 }).notNull(),
  gambar: text("gambar").notNull(),
  kategori: varchar("kategori", { length: 100 }).notNull().default("Umum"),
  deskripsi: text("deskripsi"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertGaleriSchema = createInsertSchema(galeriTable).omit({ id: true, created_at: true });
export type InsertGaleri = z.infer<typeof insertGaleriSchema>;
export type Galeri = typeof galeriTable.$inferSelect;
