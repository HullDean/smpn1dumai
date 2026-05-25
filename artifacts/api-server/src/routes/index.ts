import { Router, type IRouter } from "express";
import healthRouter from "./health";
import beritaRouter from "./berita";
import guruRouter from "./guru";
import galeriRouter from "./galeri";
import pengumumanRouter from "./pengumuman";
import prestasiRouter from "./prestasi";
import ekskulRouter from "./ekskul";
import profilRouter from "./profil";
import sliderRouter from "./slider";
import spmbRouter from "./spmb";
import statistikRouter from "./statistik";
import adminRouter from "./admin";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(beritaRouter);
router.use(guruRouter);
router.use(galeriRouter);
router.use(pengumumanRouter);
router.use(prestasiRouter);
router.use(ekskulRouter);
router.use(profilRouter);
router.use(sliderRouter);
router.use(spmbRouter);
router.use(statistikRouter);
router.use(adminRouter);
router.use(uploadRouter);

export default router;
