import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, asc } from "drizzle-orm";
import { db, sliderTable } from "@workspace/db";
import {
  CreateSliderBody,
  DeleteSliderParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/slider", async (_req, res): Promise<void> => {
  const data = await db.select().from(sliderTable).where(eq(sliderTable.is_active, true)).orderBy(asc(sliderTable.urutan));
  res.json(data);
});

router.post(
  "/slider",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreateSliderBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await db.insert(sliderTable).values(parsed.data);
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(sliderTable).where(eq(sliderTable.id, insertId));
    res.status(201).json(item);
  },
);

router.delete(
  "/slider/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeleteSliderParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(sliderTable).where(eq(sliderTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Slider tidak ditemukan" });
      return;
    }
    await db.delete(sliderTable).where(eq(sliderTable.id, params.data.id));
    res.json({ success: true, message: "Slider dihapus" });
  },
);

export default router;
