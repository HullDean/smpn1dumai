import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, asc } from "drizzle-orm";
import { db, ekskulTable } from "@workspace/db";
import {
  CreateEkskulBody,
  UpdateEkskulBody,
  UpdateEkskulParams,
  DeleteEkskulParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/ekskul", async (_req, res): Promise<void> => {
  const data = await db.select().from(ekskulTable).orderBy(asc(ekskulTable.nama));
  res.json(data);
});

router.post(
  "/ekskul",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreateEkskulBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await db.insert(ekskulTable).values(parsed.data);
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(ekskulTable).where(eq(ekskulTable.id, insertId));
    res.status(201).json(item);
  },
);

router.put(
  "/ekskul/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = UpdateEkskulParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateEkskulBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [existing] = await db.select().from(ekskulTable).where(eq(ekskulTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Ekskul tidak ditemukan" });
      return;
    }
    await db.update(ekskulTable).set(parsed.data).where(eq(ekskulTable.id, params.data.id));
    const [item] = await db.select().from(ekskulTable).where(eq(ekskulTable.id, params.data.id));
    res.json(item);
  },
);

router.delete(
  "/ekskul/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeleteEkskulParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(ekskulTable).where(eq(ekskulTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Ekskul tidak ditemukan" });
      return;
    }
    await db.delete(ekskulTable).where(eq(ekskulTable.id, params.data.id));
    res.json({ success: true, message: "Ekskul dihapus" });
  },
);

export default router;
