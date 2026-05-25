import { mysqlTable, text, boolean, serial, int, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const spmbTable = mysqlTable("spmb", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 300 }).notNull().default("Penerimaan Peserta Didik Baru"),
  konten: text("konten").notNull().default("Informasi SPMB akan segera diumumkan."),
  tanggal_buka: varchar("tanggal_buka", { length: 20 }),
  tanggal_tutup: varchar("tanggal_tutup", { length: 20 }),
  kuota: int("kuota"),
  persyaratan: text("persyaratan"),
  link_pendaftaran: text("link_pendaftaran"),
  is_active: boolean("is_active").notNull().default(false),
});

export const insertSpmbSchema = createInsertSchema(spmbTable).omit({ id: true });
export type InsertSpmb = z.infer<typeof insertSpmbSchema>;
export type Spmb = typeof spmbTable.$inferSelect;
