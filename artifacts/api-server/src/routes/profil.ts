import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, profilTable } from "@workspace/db";
import { UpdateProfilBody } from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/profil", async (_req, res): Promise<void> => {
  const [item] = await db.select().from(profilTable);
  if (!item) {
    res.status(404).json({ error: "Profil belum dikonfigurasi" });
    return;
  }
  res.json(item);
});

router.put(
  "/profil",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = UpdateProfilBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const existing = await db.select().from(profilTable);
    if (existing.length === 0) {
      const result = await db.insert(profilTable).values(parsed.data);
      const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
      const [item] = await db.select().from(profilTable).where(eq(profilTable.id, insertId));
      res.json(item);
    } else {
      await db.update(profilTable).set(parsed.data).where(eq(profilTable.id, existing[0].id));
      const [item] = await db.select().from(profilTable).where(eq(profilTable.id, existing[0].id));
      res.json(item);
    }
  },
);

export default router;
