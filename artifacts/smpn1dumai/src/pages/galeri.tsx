import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGaleri } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ZoomIn, Image, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = ["Semua", "Kegiatan", "Prestasi", "Fasilitas", "Olahraga", "Sosial", "Pramuka"];

interface LightboxState {
  items: { src: string; title: string; kategori?: string }[];
  currentIndex: number;
}

export default function Galeri() {
  const { data: galeri, isLoading } = useListGaleri();
  const [kategori, setKategori] = useState("Semua");
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const filtered = (galeri?.data ?? []).filter((g) => kategori === "Semua" || g.kategori === kategori);

  const openLightbox = (index: number) => {
    setLightbox({
      items: filtered.map((g) => ({ src: g.gambar ?? "", title: g.judul ?? "", kategori: g.kategori ?? undefined })),
      currentIndex: index,
    });
  };

  const closeLightbox = () => setLightbox(null);

  const navigate = useCallback((dir: 1 | -1) => {
    setLightbox((prev) => {
      if (!prev) return null;
      const n = prev.items.length;
      return { ...prev, currentIndex: (prev.currentIndex + dir + n) % n };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, navigate]);

  const currentItem = lightbox ? lightbox.items[lightbox.currentIndex] : null;

  return (
    <div>
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5298] text-white py-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-6 right-12 w-40 h-40 rounded-full border-2 border-[#c9a84c]/15 pointer-events-none" />
        <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-[#c9a84c]/10 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Dokumentasi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Galeri Foto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Kumpulan dokumentasi kegiatan dan fasilitas SMP Negeri 1 Dumai.
          </motion.p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filter buttons with layout animation */}
          <div className="flex flex-wrap gap-2 justify-center mb-10 relative">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setKategori(cat)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  kategori === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground/80 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {kategori === cat && (
                  <motion.span
                    layoutId="filterBg"
                    className="absolute inset-0 rounded-full bg-primary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-video rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <Image size={40} className="text-primary/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Belum ada foto dalam kategori ini</h3>
              <p className="text-muted-foreground text-sm">Pilih kategori lain atau lihat semua foto</p>
            </div>
          ) : (
            <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                    className="break-inside-avoid group cursor-pointer relative rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all"
                    onClick={() => openLightbox(i)}
                  >
                    {item.gambar && (
                      <img
                        src={item.gambar}
                        alt={item.judul ?? ""}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-[#1e3a5f]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1 }}
                        className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2"
                      >
                        <ZoomIn size={22} className="text-white" />
                      </motion.div>
                      <p className="text-white text-sm font-medium text-center leading-tight">{item.judul}</p>
                      {item.kategori && <p className="text-[#c9a84c] text-xs mt-1">{item.kategori}</p>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox with prev/next navigation */}
      <AnimatePresence>
        {lightbox && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            {/* Prev button */}
            {lightbox.items.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next button */}
            {lightbox.items.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                aria-label="Foto berikutnya"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox.currentIndex}
                initial={{ opacity: 0, scale: 0.92, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                src={currentItem.src}
                alt={currentItem.title}
                className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Caption */}
            {currentItem.title && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-center px-4">
                <p className="font-semibold text-lg">{currentItem.title}</p>
                {currentItem.kategori && <p className="text-[#c9a84c] text-sm mt-1">{currentItem.kategori}</p>}
                {lightbox.items.length > 1 && (
                  <p className="text-white/50 text-xs mt-1">{lightbox.currentIndex + 1} / {lightbox.items.length}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
