import { Router, type IRouter } from "express";
import { eq, sql, count } from "drizzle-orm";
import { db, statistikTable, pengunjungHarianTable, beritaTable, guruTable, galeriTable, prestasiTable, ekskulTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/statistik", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];

  // Run all DB queries in parallel — was sequential before
  const [
    [statsRow],
    [todayVisit],
    [guruCount],
    [galeriCount],
    [prestasiCount],
    [ekskulCount],
  ] = await Promise.all([
    db.select().from(statistikTable),
    db.select().from(pengunjungHarianTable).where(eq(pengunjungHarianTable.tanggal, today)),
    db.select({ count: count() }).from(guruTable).where(eq(guruTable.is_active, true)),
    db.select({ count: count() }).from(galeriTable),
    db.select({ count: count() }).from(prestasiTable),
    db.select({ count: count() }).from(ekskulTable).where(eq(ekskulTable.is_active, true)),
  ]);

  res.json({
    total_siswa: statsRow?.total_siswa ?? 720,
    total_guru: Number(guruCount.count),
    total_staff: statsRow?.total_staff ?? 20,
    total_kelas: statsRow?.total_kelas ?? 24,
    pengunjung_hari_ini: todayVisit?.jumlah ?? 0,
    total_pengunjung: statsRow?.total_pengunjung ?? 0,
    total_prestasi: Number(prestasiCount.count),
    total_ekskul: Number(ekskulCount.count),
  });
});

router.post("/statistik/pengunjung", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];

  await db
    .insert(pengunjungHarianTable)
    .values({ tanggal: today, jumlah: 1 })
    .onConflictDoUpdate({
      target: pengunjungHarianTable.tanggal,
      set: { jumlah: sql`${pengunjungHarianTable.jumlah} + 1` },
    });

  const [stats] = await db.select().from(statistikTable);
  if (stats) {
    await db.update(statistikTable).set({ total_pengunjung: stats.total_pengunjung + 1 });
  } else {
    await db.insert(statistikTable).values({ total_pengunjung: 1, last_reset: today });
  }

  const [todayVisit] = await db.select().from(pengunjungHarianTable).where(eq(pengunjungHarianTable.tanggal, today));
  const [updatedStats] = await db.select().from(statistikTable);

  res.json({
    pengunjung_hari_ini: todayVisit?.jumlah ?? 1,
    total_pengunjung: updatedStats?.total_pengunjung ?? 1,
  });
});

export default router;
