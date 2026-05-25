import { mysqlTable, text, boolean, serial, int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const statistikTable = mysqlTable("statistik", {
  id: serial("id").primaryKey(),
  total_siswa: int("total_siswa").notNull().default(0),
  total_guru: int("total_guru").notNull().default(0),
  total_staff: int("total_staff").notNull().default(0),
  total_kelas: int("total_kelas").notNull().default(0),
  total_pengunjung: int("total_pengunjung").notNull().default(0),
  last_reset: varchar("last_reset", { length: 20 }).notNull().default(""),
});

export const pengunjungHarianTable = mysqlTable("pengunjung_harian", {
  id: serial("id").primaryKey(),
  tanggal: varchar("tanggal", { length: 20 }).notNull().unique(),
  jumlah: int("jumlah").notNull().default(0),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const adminTable = mysqlTable("admin", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 200 }).notNull(),
  nama: varchar("nama", { length: 200 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertStatistikSchema = createInsertSchema(statistikTable).omit({ id: true });
export type InsertStatistik = z.infer<typeof insertStatistikSchema>;
export type Statistik = typeof statistikTable.$inferSelect;
