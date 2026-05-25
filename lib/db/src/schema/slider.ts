import { mysqlTable, text, boolean, serial, int, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sliderTable = mysqlTable("slider", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 300 }).notNull(),
  subjudul: text("subjudul"),
  gambar: text("gambar").notNull(),
  urutan: int("urutan").notNull().default(0),
  is_active: boolean("is_active").notNull().default(true),
});

export const insertSliderSchema = createInsertSchema(sliderTable).omit({ id: true });
export type InsertSlider = z.infer<typeof insertSliderSchema>;
export type Slider = typeof sliderTable.$inferSelect;
