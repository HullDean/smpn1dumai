import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc, like, and, or, sql } from "drizzle-orm";
import { db, beritaTable } from "@workspace/db";
import {
  ListBeritaQueryParams,
  CreateBeritaBody,
  GetBeritaByIdParams,
  UpdateBeritaBody,
  UpdateBeritaParams,
  DeleteBeritaParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

function makeSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + Date.now();
}

router.get("/berita", async (req, res): Promise<void> => {
  const query = ListBeritaQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { page, limit, kategori, search } = query.data;
  const offset = (page - 1) * limit;

  const conditions = [eq(beritaTable.is_published, true)];
  if (kategori) conditions.push(eq(beritaTable.kategori, kategori));
  if (search) {
    conditions.push(
      or(
        like(beritaTable.judul, `%${search}%`),
        like(beritaTable.konten, `%${search}%`)
      )!
    );
  }

  const where = and(...conditions);
  const [data, countResult] = await Promise.all([
    db.select().from(beritaTable).where(where).orderBy(desc(beritaTable.created_at)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(beritaTable).where(where),
  ]);

  res.json({ data, total: Number(countResult[0].count), page, limit });
});

router.get("/berita/terbaru", async (_req, res): Promise<void> => {
  const data = await db
    .select()
    .from(beritaTable)
    .where(eq(beritaTable.is_published, true))
    .orderBy(desc(beritaTable.created_at))
    .limit(6);
  res.json(data);
});

router.get("/berita/:id", async (req, res): Promise<void> => {
  const params = GetBeritaByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(beritaTable).where(eq(beritaTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Berita tidak ditemukan" });
    return;
  }
  await db.update(beritaTable).set({ dilihat: item.dilihat + 1 }).where(eq(beritaTable.id, params.data.id));
  res.json(item);
});

router.post(
  "/berita",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreateBeritaBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const slug = makeSlug(parsed.data.judul);
    const result = await db.insert(beritaTable).values({ ...parsed.data, slug });
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(beritaTable).where(eq(beritaTable.id, insertId));
    res.status(201).json(item);
  },
);

router.put(
  "/berita/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = UpdateBeritaParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateBeritaBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [existing] = await db.select().from(beritaTable).where(eq(beritaTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }
    await db.update(beritaTable).set(parsed.data).where(eq(beritaTable.id, params.data.id));
    const [item] = await db.select().from(beritaTable).where(eq(beritaTable.id, params.data.id));
    res.json(item);
  },
);

router.delete(
  "/berita/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeleteBeritaParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(beritaTable).where(eq(beritaTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }
    await db.delete(beritaTable).where(eq(beritaTable.id, params.data.id));
    res.json({ success: true, message: "Berita dihapus" });
  },
);

export default router;
