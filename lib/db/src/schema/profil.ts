import { mysqlTable, text, serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilTable = mysqlTable("profil", {
  id: serial("id").primaryKey(),
  nama_sekolah: varchar("nama_sekolah", { length: 300 }).notNull().default("SMP Negeri 1 Dumai"),
  npsn: varchar("npsn", { length: 20 }).notNull().default("10401601"),
  alamat: text("alamat").notNull().default("Jl. Pattimura No. 1, Dumai"),
  telepon: varchar("telepon", { length: 50 }),
  email: varchar("email", { length: 200 }),
  website: varchar("website", { length: 300 }),
  kepala_sekolah: varchar("kepala_sekolah", { length: 300 }).notNull().default("Kepala Sekolah"),
  foto_kepsek: text("foto_kepsek"),
  sambutan_kepsek: text("sambutan_kepsek"),
  visi: text("visi").notNull().default(""),
  misi: text("misi").notNull().default(""),
  sejarah: text("sejarah"),
  akreditasi: varchar("akreditasi", { length: 10 }).default("A"),
  tahun_berdiri: varchar("tahun_berdiri", { length: 10 }).default("1964"),
  logo: text("logo"),
});

export const insertProfilSchema = createInsertSchema(profilTable).omit({ id: true });
export type InsertProfil = z.infer<typeof insertProfilSchema>;
export type Profil = typeof profilTable.$inferSelect;
