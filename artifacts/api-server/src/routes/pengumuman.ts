import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc } from "drizzle-orm";
import { db, pengumumanTable } from "@workspace/db";
import {
  CreatePengumumanBody,
  UpdatePengumumanBody,
  UpdatePengumumanParams,
  DeletePengumumanParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/pengumuman", async (_req, res): Promise<void> => {
  const data = await db.select().from(pengumumanTable).orderBy(desc(pengumumanTable.prioritas), desc(pengumumanTable.created_at));
  res.json(data);
});

router.post(
  "/pengumuman",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreatePengumumanBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await db.insert(pengumumanTable).values(parsed.data);
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(pengumumanTable).where(eq(pengumumanTable.id, insertId));
    res.status(201).json(item);
  },
);

router.put(
  "/pengumuman/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = UpdatePengumumanParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdatePengumumanBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [existing] = await db.select().from(pengumumanTable).where(eq(pengumumanTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Pengumuman tidak ditemukan" });
      return;
    }
    await db.update(pengumumanTable).set(parsed.data).where(eq(pengumumanTable.id, params.data.id));
    const [item] = await db.select().from(pengumumanTable).where(eq(pengumumanTable.id, params.data.id));
    res.json(item);
  },
);

router.delete(
  "/pengumuman/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeletePengumumanParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(pengumumanTable).where(eq(pengumumanTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Pengumuman tidak ditemukan" });
      return;
    }
    await db.delete(pengumumanTable).where(eq(pengumumanTable.id, params.data.id));
    res.json({ success: true, message: "Pengumuman dihapus" });
  },
);

export default router;
