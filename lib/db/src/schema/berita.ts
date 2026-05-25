import { mysqlTable, text, int, boolean, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const beritaTable = mysqlTable("berita", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  konten: text("konten").notNull(),
  gambar: text("gambar"),
  kategori: varchar("kategori", { length: 100 }).notNull().default("Berita"),
  penulis: varchar("penulis", { length: 200 }).notNull().default("Admin"),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  is_published: boolean("is_published").notNull().default(true),
  dilihat: int("dilihat").notNull().default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const insertBeritaSchema = createInsertSchema(beritaTable).omit({ id: true, created_at: true, updated_at: true, slug: true, dilihat: true });
export type InsertBerita = z.infer<typeof insertBeritaSchema>;
export type Berita = typeof beritaTable.$inferSelect;
