import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, like, or, asc, desc } from "drizzle-orm";
import { db, guruTable } from "@workspace/db";
import {
  ListGuruQueryParams,
  CreateGuruBody,
  GetGuruByIdParams,
  UpdateGuruBody,
  UpdateGuruParams,
  DeleteGuruParams,
} from "@workspace/api-zod";
import { requireAuth } from "./admin";

const router: IRouter = Router();

router.get("/guru", async (req, res): Promise<void> => {
  const query = ListGuruQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { search, mata_pelajaran, sort, order } = query.data;

  let qb = db.select().from(guruTable).$dynamic();

  const conditions = [];
  if (search) {
    conditions.push(or(like(guruTable.nama, `%${search}%`), like(guruTable.nip, `%${search}%`)));
  }
  if (mata_pelajaran && mata_pelajaran !== "Semua Mata Pelajaran") {
    conditions.push(eq(guruTable.mata_pelajaran, mata_pelajaran));
  }

  for (const cond of conditions) {
    if (cond) qb = qb.where(cond);
  }

  const sortCol = sort === "mata_pelajaran" ? guruTable.mata_pelajaran : guruTable.nama;
  qb = qb.orderBy(order === "desc" ? desc(sortCol) : asc(sortCol));

  const data = await qb;
  res.json(data);
});

router.get("/guru/:id", async (req, res): Promise<void> => {
  const params = GetGuruByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(guruTable).where(eq(guruTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Guru tidak ditemukan" });
    return;
  }
  res.json(item);
});

router.post(
  "/guru",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const parsed = CreateGuruBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await db.insert(guruTable).values(parsed.data);
    const insertId = Number((result as unknown as [{ insertId: number }])[0].insertId);
    const [item] = await db.select().from(guruTable).where(eq(guruTable.id, insertId));
    res.status(201).json(item);
  },
);

router.put(
  "/guru/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = UpdateGuruParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateGuruBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [existing] = await db.select().from(guruTable).where(eq(guruTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Guru tidak ditemukan" });
      return;
    }
    await db.update(guruTable).set(parsed.data).where(eq(guruTable.id, params.data.id));
    const [item] = await db.select().from(guruTable).where(eq(guruTable.id, params.data.id));
    res.json(item);
  },
);

router.delete(
  "/guru/:id",
  requireAuth as (req: Request, res: Response, next: NextFunction) => void,
  async (req, res): Promise<void> => {
    const params = DeleteGuruParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [item] = await db.select().from(guruTable).where(eq(guruTable.id, params.data.id));
    if (!item) {
      res.status(404).json({ error: "Guru tidak ditemukan" });
      return;
    }
    await db.delete(guruTable).where(eq(guruTable.id, params.data.id));
    res.json({ success: true, message: "Guru dihapus" });
  },
);

export default router;
