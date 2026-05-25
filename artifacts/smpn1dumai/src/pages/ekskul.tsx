import { motion } from "framer-motion";
import { useListEkskul } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Layers } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animation";

export default function Ekskul() {
  const { data: ekskul, isLoading } = useListEkskul();
  const active = (ekskul ?? []).filter((e) => e.is_active);

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
            Pengembangan Diri
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Ekstrakurikuler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Wadah pengembangan bakat, minat, dan karakter peserta didik di luar jam pelajaran.
          </motion.p>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <Layers size={40} className="text-primary/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Belum ada data ekstrakurikuler</h3>
              <p className="text-muted-foreground text-sm">Data akan segera ditambahkan</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((e) => (
                <StaggerItem key={e.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group h-full"
                  >
                    {e.gambar ? (
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={e.gambar}
                          alt={e.nama ?? ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(ev) => { ev.currentTarget.style.display = "none"; }}
                        />
                        {/* Hover overlay */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/90 via-[#1e3a5f]/50 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100"
                        >
                          <p className="text-white font-bold text-base">{e.nama}</p>
                          {e.pembina && <p className="text-blue-200 text-xs mt-0.5">Pembina: {e.pembina}</p>}
                          {e.jadwal && <p className="text-[#c9a84c] text-xs mt-0.5">{e.jadwal}</p>}
                        </motion.div>
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-[#1e3a5f] to-[#2a5298] flex items-center justify-center">
                        <Layers size={48} className="text-white/30" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-primary">{e.nama}</h3>
                        <Badge variant="secondary" className="bg-[#c9a84c]/20 text-foreground text-xs">Aktif</Badge>
                      </div>
                      {e.deskripsi && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{e.deskripsi}</p>
                      )}
                      <div className="space-y-1.5 text-sm">
                        {e.pembina && (
                          <div className="flex items-center gap-2 text-foreground/70">
                            <User size={14} className="text-primary" />
                            <span>Pembina: {e.pembina}</span>
                          </div>
                        )}
                        {e.jadwal && (
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Clock size={14} className="text-primary" />
                            <span>{e.jadwal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
