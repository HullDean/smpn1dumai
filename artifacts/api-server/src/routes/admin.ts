import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc, count } from "drizzle-orm";
import { db, adminTable, beritaTable, guruTable, galeriTable, prestasiTable, statistikTable, pengunjungHarianTable } from "@workspace/db";
import { AdminLoginBody } from "@workspace/api-zod";
import { createHash } from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "smpn1dumai_salt").digest("hex");
}

function verifyToken(req: Request): { id: number; username: string; nama: string; role: string } | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = verifyToken(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { adminUser: typeof user }).adminUser = user;
  next();
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  const [admin] = await db.select().from(adminTable).where(eq(adminTable.username, username));
  if (!admin || admin.password_hash !== hashPassword(password)) {
    res.status(401).json({ error: "Username atau password salah" });
    return;
  }
  const user = { id: admin.id, username: admin.username, nama: admin.nama, role: admin.role };
  const token = Buffer.from(JSON.stringify(user)).toString("base64");
  res.json({ success: true, token, user });
});

router.post("/admin/logout", (_req, res): void => {
  res.json({ success: true, message: "Logout berhasil" });
});

router.get("/admin/me", requireAuth as (req: Request, res: Response, next: NextFunction) => void, (req, res): void => {
  const user = (req as Request & { adminUser: ReturnType<typeof verifyToken> }).adminUser;
  res.json(user);
});

router.get("/admin/dashboard", requireAuth as (req: Request, res: Response, next: NextFunction) => void, async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];

  const [[beritaCount], [guruCount], [galeriCount], [prestasiCount], stats, todayVisit, beritaTerbaru] = await Promise.all([
    db.select({ count: count() }).from(beritaTable),
    db.select({ count: count() }).from(guruTable),
    db.select({ count: count() }).from(galeriTable),
    db.select({ count: count() }).from(prestasiTable),
    db.select().from(statistikTable),
    db.select().from(pengunjungHarianTable).where(eq(pengunjungHarianTable.tanggal, today)),
    db.select().from(beritaTable).orderBy(desc(beritaTable.created_at)).limit(5),
  ]);

  res.json({
    total_berita: Number(beritaCount.count),
    total_guru: Number(guruCount.count),
    total_galeri: Number(galeriCount.count),
    total_prestasi: Number(prestasiCount.count),
    total_pengunjung: stats[0]?.total_pengunjung ?? 0,
    pengunjung_hari_ini: todayVisit[0]?.jumlah ?? 0,
    berita_terbaru: beritaTerbaru,
  });
});

export { requireAuth };
export default router;
