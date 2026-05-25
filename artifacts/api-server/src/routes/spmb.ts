import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, spmbTable } from "@workspace/db";
import { UpdateSpmbInfoBody } from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/spmb", async (_req, res): Promise<void> => {
  const [item] = await db.select().from(spmbTable);
  if (!item) {
    res.status(404).json({ error: "Info SPMB belum dikonfigurasi" });
    return;
  }
  res.json(item);
});

router.put(
  "/spmb",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = UpdateSpmbInfoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const existing = await db.select().from(spmbTable);
    if (existing.length === 0) {
      const result = await db.insert(spmbTable).values(parsed.data);
      const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
      const [item] = await db.select().from(spmbTable).where(eq(spmbTable.id, insertId));
      res.json(item);
    } else {
      await db.update(spmbTable).set(parsed.data).where(eq(spmbTable.id, existing[0].id));
      const [item] = await db.select().from(spmbTable).where(eq(spmbTable.id, existing[0].id));
      res.json(item);
    }
  },
);

export default router;
