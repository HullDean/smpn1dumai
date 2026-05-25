import { motion } from "framer-motion";
import { useListPengumuman } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animation";

const PRIORITY_LABELS: Record<number, string> = { 1: "Biasa", 2: "Penting", 3: "Segera" };

export default function Pengumuman() {
  const { data: pengumuman, isLoading } = useListPengumuman();
  const active = (pengumuman ?? []).filter((p) => p.is_active).sort((a, b) => (b.prioritas ?? 0) - (a.prioritas ?? 0));

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
            Informasi Resmi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Pengumuman
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Informasi penting dan pengumuman resmi dari SMP Negeri 1 Dumai.
          </motion.p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <Bell size={40} className="text-primary/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Tidak ada pengumuman aktif</h3>
              <p className="text-muted-foreground text-sm">Pantau terus untuk informasi terbaru</p>
            </div>
          ) : (
            <StaggerContainer staggerDelay={0.07} className="space-y-4">
              {active.map((item) => {
                const priority = item.prioritas ?? 1;
                const isUrgent = priority === 3;
                const isImportant = priority === 2;

                return (
                  <StaggerItem key={item.id}>
                    <div
                      className={`bg-white rounded-2xl p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden ${
                        isUrgent
                          ? "border-l-4 border-red-400 border border-red-100"
                          : isImportant
                          ? "border-l-4 border-blue-400 border border-blue-50"
                          : "border border-gray-100"
                      }`}
                    >
                      {/* Priority accent bg */}
                      {isUrgent && <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
                      {isImportant && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />}

                      <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                              isUrgent ? "bg-red-100" : isImportant ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            {isUrgent ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              >
                                <Bell size={20} className="text-red-600" />
                              </motion.div>
                            ) : (
                              <Bell
                                size={20}
                                className={isImportant ? "text-blue-600" : "text-gray-500"}
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-foreground leading-snug">{item.judul}</h3>
                            {item.created_at && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Calendar size={11} />
                                {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={`shrink-0 text-xs font-bold px-3 py-1 ${
                            isUrgent
                              ? "bg-red-100 text-red-700"
                              : isImportant
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isUrgent ? "🔴 Segera" : isImportant ? "🔵 Penting" : "Biasa"}
                        </Badge>
                      </div>
                      {item.konten && (
                        <p className="text-foreground/65 leading-relaxed text-sm ml-14 relative z-10">{item.konten}</p>
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
