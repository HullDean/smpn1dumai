import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc } from "drizzle-orm";
import { db, prestasiTable } from "@workspace/db";
import {
  ListPrestasiQueryParams,
  CreatePrestasiBody,
  UpdatePrestasiBody,
  UpdatePrestasiParams,
  DeletePrestasiParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/prestasi", async (req, res): Promise<void> => {
  const query = ListPrestasiQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { kategori } = query.data;
  let qb = db.select().from(prestasiTable).$dynamic();
  if (kategori) qb = qb.where(eq(prestasiTable.kategori, kategori));
  const data = await qb.orderBy(desc(prestasiTable.created_at));
  res.json(data);
});

router.post(
  "/prestasi",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreatePrestasiBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await db.insert(prestasiTable).values(parsed.data);
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(prestasiTable).where(eq(prestasiTable.id, insertId));
    res.status(201).json(item);
  },
);

router.put(
  "/prestasi/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = UpdatePrestasiParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdatePrestasiBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [existing] = await db.select().from(prestasiTable).where(eq(prestasiTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Prestasi tidak ditemukan" });
      return;
    }
    await db.update(prestasiTable).set(parsed.data).where(eq(prestasiTable.id, params.data.id));
    const [item] = await db.select().from(prestasiTable).where(eq(prestasiTable.id, params.data.id));
    res.json(item);
  },
);

router.delete(
  "/prestasi/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeletePrestasiParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(prestasiTable).where(eq(prestasiTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Prestasi tidak ditemukan" });
      return;
    }
    await db.delete(prestasiTable).where(eq(prestasiTable.id, params.data.id));
    res.json({ success: true, message: "Prestasi dihapus" });
  },
);

export default router;
