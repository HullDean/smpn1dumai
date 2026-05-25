import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc, and, sql } from "drizzle-orm";
import { db, galeriTable } from "@workspace/db";
import {
  ListGaleriQueryParams,
  CreateGaleriBody,
  DeleteGaleriParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/galeri", async (req, res): Promise<void> => {
  const query = ListGaleriQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { page, limit, kategori } = query.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (kategori && kategori !== "Semua") conditions.push(eq(galeriTable.kategori, kategori));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db.select().from(galeriTable).where(where).orderBy(desc(galeriTable.created_at)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(galeriTable).where(where),
  ]);

  res.json({ data, total: Number(countResult[0].count), page, limit });
});

router.post(
  "/galeri",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreateGaleriBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await db.insert(galeriTable).values(parsed.data);
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(galeriTable).where(eq(galeriTable.id, insertId));
    res.status(201).json(item);
  },
);

router.delete(
  "/galeri/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeleteGaleriParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(galeriTable).where(eq(galeriTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Foto tidak ditemukan" });
      return;
    }
    await db.delete(galeriTable).where(eq(galeriTable.id, params.data.id));
    res.json({ success: true, message: "Foto dihapus" });
  },
);

export default router;
