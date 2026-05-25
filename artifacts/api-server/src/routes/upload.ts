import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { requireAuth } from "./admin";

const router: IRouter = Router();

// Pastikan folder uploads ada
const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan (jpg, png, webp, gif, svg)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// POST /api/upload — upload satu gambar, butuh auth admin
router.post(
  "/upload",
  requireAuth as (req: Request, res: Response, next: () => void) => void,
  (req: Request, res: Response) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).json({ error: "Ukuran file maksimal 5 MB" });
          return;
        }
        res.status(400).json({ error: err.message });
        return;
      }
      if (err) {
        res.status(400).json({ error: (err as Error).message });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "Tidak ada file yang diupload" });
        return;
      }

      // Kembalikan URL yang bisa diakses publik
      const protocol = req.protocol;
      const host = req.get("host") ?? "localhost";
      const url = `${protocol}://${host}/uploads/${req.file.filename}`;

      res.status(201).json({
        url,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    });
  },
);

// DELETE /api/upload/:filename — hapus file, butuh auth admin
router.delete(
  "/upload/:filename",
  requireAuth as (req: Request, res: Response, next: () => void) => void,
  (req: Request, res: Response) => {
    const { filename } = req.params;

    // Cegah path traversal
    if (filename.includes("/") || filename.includes("..")) {
      res.status(400).json({ error: "Nama file tidak valid" });
      return;
    }

    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File tidak ditemukan" });
      return;
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: "File dihapus" });
  },
);

export default router;
