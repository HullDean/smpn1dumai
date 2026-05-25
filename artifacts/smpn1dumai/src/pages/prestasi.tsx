import { useState } from "react";
import { motion } from "framer-motion";
import { useListPrestasi } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animation";

const TINGKAT = ["Semua", "Kota", "Provinsi", "Nasional", "Internasional"];

export default function Prestasi() {
  const { data: prestasi, isLoading } = useListPrestasi();
  const [filter, setFilter] = useState("Semua");

  const filtered = (prestasi ?? []).filter((p) => filter === "Semua" || p.tingkat === filter);

  const grouped = TINGKAT.slice(1).reduce<Record<string, typeof filtered>>((acc, t) => {
    const items = filtered.filter((p) => p.tingkat === t);
    if (items.length > 0) acc[t] = items;
    return acc;
  }, {});

  return (
    <div>
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5298] text-white py-20 relative overflow-hidden">
        <div className="absolute top-6 right-12 w-40 h-40 rounded-full border-2 border-[#c9a84c]/15 pointer-events-none" />
        <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-[#c9a84c]/10 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Kebanggaan Sekolah
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Prestasi Siswa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Berbagai pencapaian membanggakan dari peserta didik SMPN 1 Dumai.
          </motion.p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {TINGKAT.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === t
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground/80 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <Trophy size={40} className="text-primary/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Belum ada prestasi tercatat</h3>
              <p className="text-muted-foreground text-sm">Data prestasi akan segera ditambahkan</p>
            </div>
          ) : filter !== "Semua" ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <StaggerItem key={p.id}>
                  <PrestasiCard prestasi={p} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            Object.entries(grouped).map(([tingkat, items]) => (
              <div key={tingkat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Award size={24} className="text-[#c9a84c]" />
                  <h2 className="text-2xl font-bold text-primary">Tingkat {tingkat}</h2>
                  <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-0.5 rounded-full">{items.length}</span>
                </div>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((p) => (
                    <StaggerItem key={p.id}>
                      <PrestasiCard prestasi={p} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function PrestasiCard({ prestasi: p }: { prestasi: any }) {
  const levelConfig: Record<string, { gradient: string; glow: string; badge: string }> = {
    "Internasional": { gradient: "from-amber-600 to-yellow-500", glow: "rgba(245,158,11,0.4)", badge: "bg-yellow-400 text-yellow-900" },
    "Nasional": { gradient: "from-[#1e3a5f] to-[#2a5298]", glow: "rgba(201,168,76,0.35)", badge: "bg-[#c9a84c] text-white" },
    "Provinsi": { gradient: "from-slate-700 to-slate-600", glow: "rgba(100,116,139,0.3)", badge: "bg-slate-400 text-white" },
    "Kota": { gradient: "from-[#1e4a6e] to-[#1e3a5f]", glow: "rgba(30,58,95,0.3)", badge: "bg-blue-400 text-white" },
  };
  const cfg = levelConfig[p.tingkat] ?? levelConfig["Kota"];

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: `0 0 24px ${cfg.glow}` }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`bg-gradient-to-br ${cfg.gradient} rounded-2xl p-6 text-white shadow-md cursor-default relative overflow-hidden`}
    >
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <Trophy size={24} className="text-white" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className={`${cfg.badge} text-xs font-bold px-2.5`}>{p.tingkat}</Badge>
            {p.kategori && <Badge variant="outline" className="border-white/30 text-white/80 text-xs">{p.kategori}</Badge>}
          </div>
        </div>
        <h3 className="font-bold text-base leading-snug mb-2">{p.judul}</h3>
        {p.deskripsi && <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{p.deskripsi}</p>}
        {p.tanggal && (
          <p className="text-white/50 text-xs mt-4 font-medium">
            {new Date(p.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
