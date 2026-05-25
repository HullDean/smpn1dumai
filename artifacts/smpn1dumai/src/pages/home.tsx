import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Users, Award, Layers, Bell, ZoomIn, Quote, MapPin, Phone, Mail } from "lucide-react";
import {
  useListSlider,
  useGetBeritaTerbaru,
  useGetStatistik,
  useListPrestasi,
  useListEkskul,
  useListGaleri,
  useListPengumuman,
  useGetProfil,
  useIncrementPengunjung,
  getGetStatistikQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StaggerContainer, StaggerItem, AnimatedSection } from "@/components/animation";

// Session-scoped flag — prevents duplicate visitor increments on re-renders / HMR
const VISITOR_SESSION_KEY = "smpn1_visited";

// Dummy slides dipakai saat belum ada data dari database
const DUMMY_SLIDES = [
  {
    id: "d1",
    judul: "Selamat Datang di SMP Negeri 1 Dumai",
    subjudul: "Sekolah Unggulan Kota Dumai — Terakreditasi A. Membentuk generasi cerdas, berkarakter, dan berwawasan global.",
    gambar: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
    badge: "Terakreditasi A",
  },
  {
    id: "d2",
    judul: "Berprestasi di Tingkat Nasional & Internasional",
    subjudul: "Ratusan prestasi membanggakan dari peserta didik SMPN 1 Dumai di berbagai bidang akademik dan non-akademik.",
    gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80",
    badge: "Prestasi Terbaik",
  },
  {
    id: "d3",
    judul: "Lingkungan Belajar yang Nyaman & Modern",
    subjudul: "Fasilitas lengkap, tenaga pendidik profesional, dan suasana belajar yang kondusif untuk tumbuh kembang optimal.",
    gambar: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80",
    badge: "Fasilitas Lengkap",
  },
];

function HeroSlider() {
  const { data: sliders, isLoading } = useListSlider();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slidesLengthRef = useRef(0);

  const dbSlides = sliders?.filter((s) => s.is_active) ?? [];
  const activeSlides = dbSlides.length > 0
    ? dbSlides.map((s) => ({ id: String(s.id), judul: s.judul ?? "", subjudul: s.subjudul ?? "", gambar: s.gambar ?? "", badge: "SMP Negeri 1 Dumai" }))
    : DUMMY_SLIDES;

  slidesLengthRef.current = activeSlides.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += 100 / 50;
      setProgress(Math.min(p, 100));
    }, 100);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slidesLengthRef.current);
      setProgress(0);
    }, 6000);
  }, []); // stable — reads length via ref

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [resetTimer]);

  const go = useCallback((dir: number) => {
    setCurrent((c) => (c + dir + slidesLengthRef.current) % slidesLengthRef.current);
    resetTimer();
  }, [resetTimer]);

  if (isLoading) return (
    <div className="h-[92vh] min-h-[600px] bg-[#1e3a5f] animate-pulse flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const slide = activeSlides[current];

  return (
    <div className="relative h-[92vh] min-h-[600px] overflow-hidden bg-[#1e3a5f]">
      {/* Background slides */}
      {activeSlides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}>
          {s.gambar && (
            <img
              src={s.gambar}
              alt={s.judul}
              className="w-full h-full object-cover scale-105"
              style={{ filter: "blur(2px)" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          {/* Multi-layer overlay: blur + dark gradient */}
          <div className="absolute inset-0 bg-[#1e3a5f]/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/95 via-[#1e3a5f]/70 to-[#1e3a5f]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Decorative elements */}
      <div className="absolute top-12 right-20 w-72 h-72 rounded-full border border-[#c9a84c]/15 pointer-events-none" />
      <div className="absolute top-24 right-32 w-48 h-48 rounded-full border border-[#c9a84c]/10 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-[#c9a84c]/8 pointer-events-none" />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute top-1/3 right-16 w-20 h-20 rounded-full border border-dashed border-[#c9a84c]/20 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl text-white"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-5"
              >
                <span className="inline-flex items-center gap-2 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                  {slide.badge}
                </span>
              </motion.div>

              {/* Judul */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.7 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-lg"
              >
                {slide.judul}
              </motion.h1>

              {/* Subjudul */}
              {slide.subjudul && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-blue-100/90 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl"
                >
                  {slide.subjudul}
                </motion.p>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/profil">
                  <Button size="lg" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold rounded-full px-8 shadow-xl shadow-[#c9a84c]/30 text-base">
                    Profil Sekolah
                  </Button>
                </Link>
                <Link href="/spmb">
                  <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white hover:text-primary rounded-full px-8 backdrop-blur-sm text-base">
                    Info SPMB
                  </Button>
                </Link>
              </motion.div>

              {/* Slide counter */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-white/40 text-sm font-mono"
              >
                {String(current + 1).padStart(2, "0")} / {String(activeSlides.length).padStart(2, "0")}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm hover:scale-110"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm hover:scale-110"
        aria-label="Slide berikutnya"
      >
        <ChevronRight size={22} />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetTimer(); }}
            className={`rounded-full transition-all overflow-hidden ${i === current ? "w-14 h-2 bg-white/30" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
            aria-label={`Slide ${i + 1}`}
          >
            {i === current && (
              <motion.div className="h-full bg-[#c9a84c] rounded-full" style={{ width: `${progress}%` }} />
            )}
          </button>
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

function StatCounter({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observed = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        const duration = 1600; // ms
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic for smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * value));
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            setCount(value);
            setDone(true);
          }
        };
        rafRef.current = requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <div ref={ref} className="text-center p-8 relative group">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-xl" />
      <motion.div
        animate={done ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#c9a84c] shadow-lg shadow-[#c9a84c]/10"
      >
        {icon}
      </motion.div>
      <motion.div
        animate={done ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="text-4xl md:text-5xl font-black text-white mb-1 tabular-nums"
      >
        {count.toLocaleString()}
        <span className="text-[#c9a84c]">+</span>
      </motion.div>
      <div className="text-blue-300 font-medium text-xs uppercase tracking-widest">{label}</div>
    </div>
  );
}

export default function Home() {
  const qc = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useGetStatistik();
  const { data: berita, isLoading: beritaLoading } = useGetBeritaTerbaru();
  const { data: prestasi } = useListPrestasi();
  const { data: ekskul } = useListEkskul();
  const { data: galeri } = useListGaleri();
  const { data: pengumuman } = useListPengumuman();
  const { data: profil } = useGetProfil();
  const increment = useIncrementPengunjung();
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    // Only increment once per browser session — prevents duplicate counts on
    // re-renders, HMR reloads, and navigating back to the home page.
    if (sessionStorage.getItem(VISITOR_SESSION_KEY)) return;
    sessionStorage.setItem(VISITOR_SESSION_KEY, "1");
    increment.mutate(undefined, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetStatistikQueryKey() }),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const recentPrestasi = prestasi?.slice(0, 3) ?? [];
  const activeEkskul = (ekskul?.filter((e) => e.is_active) ?? []).slice(0, 6);
  const galeriPreview = (galeri?.data ?? []).slice(0, 6);
  const recentPengumuman = (pengumuman ?? [])
    .filter((p) => p.is_active)
    .sort((a, b) => (b.prioritas ?? 0) - (a.prioritas ?? 0))
    .slice(0, 3);

  return (
    <div>
      <HeroSlider />

      {/* Stats */}
      <section className="bg-[#1e3a5f] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Animated glow blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#c9a84c] blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.1, 0.04] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-blue-400 blur-3xl pointer-events-none"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-8 text-center">
                  <Skeleton className="h-14 w-14 rounded-2xl mx-auto mb-4 bg-white/20" />
                  <Skeleton className="h-10 w-20 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-28 mx-auto bg-white/20" />
                </div>
              ))
            ) : (
              <>
                <StatCounter value={stats?.total_siswa ?? 0} label="Peserta Didik" icon={<Users size={28} />} />
                <StatCounter value={stats?.total_guru ?? 0} label="Pendidik & Staff" icon={<BookOpen size={28} />} />
                <StatCounter value={stats?.total_kelas ?? 0} label="Rombongan Belajar" icon={<Layers size={28} />} />
                <StatCounter value={stats?.total_prestasi ?? 0} label="Prestasi Diraih" icon={<Award size={28} />} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #1e3a5f 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#c9a84c]/8 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#1e3a5f]/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection variant="slideUp" className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
              <span className="w-8 h-px bg-[#c9a84c]" />
              Dari Pimpinan Kami
              <span className="w-8 h-px bg-[#c9a84c]" />
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-primary">Sambutan Kepala Sekolah</h2>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <AnimatedSection variant="slideRight" className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                {/* Animated ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute -inset-3 rounded-full border-2 border-dashed border-[#c9a84c]/25 pointer-events-none"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="absolute -inset-6 rounded-full border border-[#c9a84c]/10 pointer-events-none"
                />
                <div className="w-52 h-52 rounded-full overflow-hidden ring-4 ring-[#c9a84c]/50 shadow-2xl shadow-[#1e3a5f]/20 bg-gradient-to-br from-[#1e3a5f] to-[#2a5298] flex items-center justify-center relative z-10">
                  {profil?.foto_kepsek ? (
                    <img src={profil.foto_kepsek} alt={profil.kepala_sekolah ?? "Kepala Sekolah"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-6xl font-black">KS</span>
                  )}
                </div>
              </div>
              <h3 className="font-black text-xl text-primary">{profil?.kepala_sekolah || "Kepala Sekolah"}</h3>
              <p className="text-muted-foreground text-sm mt-1">Kepala Sekolah</p>
              <div className="mt-2 px-4 py-1 bg-[#c9a84c]/10 rounded-full">
                <p className="text-[#c9a84c] font-bold text-xs">{profil?.nama_sekolah || "SMP Negeri 1 Dumai"}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="slideLeft" className="md:col-span-2">
              <div className="relative">
                <Quote size={80} className="text-[#c9a84c]/10 absolute -top-6 -left-6 pointer-events-none" />
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-100/50 relative z-10">
                  <p className="text-foreground/70 leading-relaxed text-base md:text-lg italic whitespace-pre-line line-clamp-6 mb-8">
                    {profil?.sambutan_kepsek || "Selamat datang di website resmi SMP Negeri 1 Dumai. Kami berkomitmen untuk memberikan pendidikan berkualitas yang membentuk generasi cerdas, berkarakter, dan berwawasan luas. Bersama seluruh civitas akademika, kami terus berinovasi demi mewujudkan visi sekolah yang unggul dan berdaya saing tinggi."}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {(profil?.kepala_sekolah || "KS").split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm">{profil?.kepala_sekolah || "Kepala Sekolah"}</p>
                        <p className="text-xs text-muted-foreground">Kepala Sekolah</p>
                      </div>
                    </div>
                    <Link href="/profil">
                      <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full gap-1.5 font-semibold">
                        Selengkapnya <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pengumuman Terbaru */}
      {recentPengumuman.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
          <div className="container mx-auto px-4">
            <AnimatedSection variant="slideUp" className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
                <span className="w-8 h-px bg-[#c9a84c]" />
                Informasi Resmi
                <span className="w-8 h-px bg-[#c9a84c]" />
              </span>
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-3xl md:text-4xl font-black text-primary">Pengumuman Terbaru</h2>
                <Link href="/pengumuman">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-[#c9a84c] gap-1 font-semibold">
                    Semua <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
            <StaggerContainer className="space-y-3 max-w-3xl mx-auto">
              {recentPengumuman.map((item) => {
                const priority = item.prioritas ?? 1;
                const isUrgent = priority === 3;
                const isImportant = priority === 2;
                return (
                  <StaggerItem key={item.id}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-default ${isUrgent ? "border-l-4 border-red-400 border border-red-50" : isImportant ? "border-l-4 border-blue-400 border border-blue-50" : "border border-gray-100"}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUrgent ? "bg-red-100" : isImportant ? "bg-blue-100" : "bg-gray-100"}`}>
                        {isUrgent ? (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <Bell size={18} className="text-red-600" />
                          </motion.div>
                        ) : (
                          <Bell size={18} className={isImportant ? "text-blue-600" : "text-gray-500"} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground leading-snug text-sm">{item.judul}</h3>
                        {item.konten && <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">{item.konten}</p>}
                      </div>
                      <Badge className={`shrink-0 text-xs font-bold ${isUrgent ? "bg-red-100 text-red-700" : isImportant ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {isUrgent ? "Segera" : isImportant ? "Penting" : "Biasa"}
                      </Badge>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Berita Terbaru */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-4">
          <AnimatedSection variant="slideUp" className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
                  <span className="w-8 h-px bg-[#c9a84c]" />
                  Terkini
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-primary">Berita & Artikel</h2>
              </div>
              <Link href="/berita">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full gap-2 font-semibold">
                  Lihat Semua <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
          {beritaLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          ) : (berita ?? []).length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={36} className="text-primary/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Belum ada berita terbaru</h3>
              <p className="text-muted-foreground text-sm">Pantau terus untuk informasi terkini dari sekolah</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(berita ?? []).map((item) => (
                <StaggerItem key={item.id}>
                  <Link href={`/berita/${item.id}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 h-full">
                      <div className="h-48 overflow-hidden bg-gray-100 relative">
                        {item.gambar ? (
                          <img src={item.gambar} alt={item.judul ?? ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary"><BookOpen size={48} /></div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-primary text-xs font-semibold backdrop-blur-sm shadow-sm">{item.kategori}</Badge>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3 leading-snug">{item.judul}</h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium">{item.penulis}</span>
                          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Prestasi */}
      {recentPrestasi.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #1e3a5f 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection variant="slideUp" className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
                    <span className="w-8 h-px bg-[#c9a84c]" />
                    Kebanggaan Kami
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-primary">Prestasi Terkini</h2>
                </div>
                <Link href="/prestasi">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full gap-2 font-semibold">Lihat Semua <ArrowRight size={16} /></Button>
                </Link>
              </div>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPrestasi.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a4f7c] rounded-3xl p-7 text-white cursor-default relative overflow-hidden shadow-xl shadow-[#1e3a5f]/20"
                  >
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#c9a84c]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 bg-[#c9a84c]/20 rounded-2xl flex items-center justify-center">
                          <Award size={22} className="text-[#c9a84c]" />
                        </div>
                        <Badge className="bg-[#c9a84c] text-white text-xs font-bold px-3">{p.tingkat}</Badge>
                      </div>
                      <h3 className="font-black text-lg leading-snug mb-2">{p.judul}</h3>
                      <p className="text-blue-200/80 text-sm leading-relaxed line-clamp-2">{p.deskripsi}</p>
                      {p.tanggal && <p className="text-[#c9a84c]/70 text-xs mt-4 font-medium">{new Date(p.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Ekskul */}
      {activeEkskul.length > 0 && (
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="container mx-auto px-4">
            <AnimatedSection variant="slideUp" className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
                    <span className="w-8 h-px bg-[#c9a84c]" />
                    Pengembangan Diri
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-primary">Ekstrakurikuler</h2>
                </div>
                <Link href="/ekskul">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full gap-2 font-semibold">Lihat Semua <ArrowRight size={16} /></Button>
                </Link>
              </div>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {activeEkskul.map((e) => (
                <StaggerItem key={e.id}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group cursor-default"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:from-primary group-hover:to-[#2a5298] group-hover:text-white transition-all duration-300 text-primary shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                      <Layers size={22} />
                    </div>
                    <h4 className="font-bold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">{e.nama}</h4>
                    {e.jadwal && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{e.jadwal}</p>}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Galeri */}
      {galeriPreview.length > 0 && (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="container mx-auto px-4">
            <AnimatedSection variant="slideUp" className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
                    <span className="w-8 h-px bg-[#c9a84c]" />
                    Dokumentasi
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-primary">Galeri Foto</h2>
                </div>
                <Link href="/galeri">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full gap-2 font-semibold">Lihat Semua <ArrowRight size={16} /></Button>
                </Link>
              </div>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galeriPreview.map((g) => (
                <StaggerItem key={g.id}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-video bg-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#1e3a5f]/20 transition-shadow"
                    onClick={() => setLightbox(g.gambar ?? null)}
                  >
                    {g.gambar && <img src={g.gambar} alt={g.judul ?? ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 via-[#1e3a5f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4 gap-2">
                      <ZoomIn size={24} className="text-white" />
                      <p className="text-white font-bold text-center text-sm leading-tight">{g.judul}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Kontak Singkat */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-4">
          <AnimatedSection variant="slideUp" className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3">
              <span className="w-8 h-px bg-[#c9a84c]" />
              Temukan Kami
              <span className="w-8 h-px bg-[#c9a84c]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary">Lokasi & Kontak</h2>
          </AnimatedSection>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <MapPin size={28} />, label: "Alamat", value: profil?.alamat || "Jl. Pattimura, Laksamana, Dumai Kota, Kota Dumai, Riau 28826" },
              { icon: <Phone size={28} />, label: "Telepon", value: profil?.telepon || "(0765) XXXXXX" },
              { icon: <Mail size={28} />, label: "Email", value: profil?.email || "info@smpn1dumai.sch.id" },
            ].map((item, i) => (
              <AnimatedSection key={i} variant="scaleIn" delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100 hover:border-[#c9a84c]/30 hover:shadow-xl hover:shadow-[#c9a84c]/5 transition-all group cursor-default"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary group-hover:from-[#c9a84c]/20 group-hover:to-[#c9a84c]/5 group-hover:text-[#c9a84c] transition-all duration-300 shadow-sm">
                    {item.icon}
                  </div>
                  <p className="font-black text-primary mb-2 text-sm uppercase tracking-wide">{item.label}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.value}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/kontak">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full gap-2 px-8 font-semibold shadow-lg shadow-primary/20">
                Lihat Peta Lokasi <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SPMB */}
      <section className="py-24 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a5298] text-white relative overflow-hidden">
        {/* Animated mesh */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#c9a84c] blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }} className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl pointer-events-none" />
        <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full border border-[#c9a84c]/20 pointer-events-none" />
        <motion.div animate={{ rotate: [360, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }} className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection variant="slideUp">
            <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-6">
              <span className="w-8 h-px bg-[#c9a84c]" />
              Tahun Ajaran 2026/2027
              <span className="w-8 h-px bg-[#c9a84c]" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Pendaftaran<br />Peserta Didik Baru</h2>
            <p className="text-blue-100/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Bergabunglah bersama ribuan alumni berprestasi. Daftarkan putra-putri terbaik Anda di SMPN 1 Dumai.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/spmb">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                  <Button size="lg" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-black rounded-full px-10 shadow-2xl shadow-[#c9a84c]/30 text-base">
                    Lihat Info SPMB <ArrowRight size={18} className="ml-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/kontak">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 backdrop-blur-sm font-semibold">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightbox(null)}>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
