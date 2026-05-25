import { motion } from "framer-motion";
import { useGetSpmbInfo } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Users, ExternalLink, FileText } from "lucide-react";
import { StaggerContainer, StaggerItem, AnimatedSection } from "@/components/animation";

export default function Spmb() {
  const { data: spmb, isLoading } = useGetSpmbInfo();

  if (isLoading) return (
    <div className="py-16 container mx-auto px-4 space-y-6 max-w-3xl">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
    </div>
  );

  if (!spmb) return (
    <div className="py-32 container mx-auto px-4 text-center text-muted-foreground">
      <p className="text-xl">Informasi SPMB belum tersedia.</p>
    </div>
  );

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
            Penerimaan Siswa Baru
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {spmb.judul}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-6"
          >
            {spmb.is_active && (
              <Badge className="bg-green-500 text-white px-4 py-1.5 text-sm font-semibold">Pendaftaran Dibuka</Badge>
            )}
            {spmb.kuota && (
              <Badge className="bg-[#c9a84c] text-white px-4 py-1.5 text-sm font-semibold">
                Kuota {spmb.kuota} Siswa
              </Badge>
            )}
          </motion.div>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Date & Quota Cards — scale animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <Calendar size={28} />,
                label: "Tanggal Buka",
                value: spmb.tanggal_buka
                  ? new Date(spmb.tanggal_buka).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                  : "-",
              },
              {
                icon: <Calendar size={28} />,
                label: "Tanggal Tutup",
                value: spmb.tanggal_tutup
                  ? new Date(spmb.tanggal_tutup).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                  : "-",
              },
              {
                icon: <Users size={28} />,
                label: "Kuota Tersedia",
                value: spmb.kuota ? `${spmb.kuota} Siswa` : "-",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  {item.icon}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="font-bold text-lg text-primary">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Content */}
          {spmb.konten && (
            <AnimatedSection variant="slideUp" className="mb-6">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <FileText size={20} /> Informasi Umum
                </h2>
                <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{spmb.konten}</p>
              </div>
            </AnimatedSection>
          )}

          {/* Persyaratan with stagger */}
          {spmb.persyaratan && (
            <AnimatedSection variant="slideUp" className="mb-6">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-primary mb-6">Persyaratan Pendaftaran</h2>
                <StaggerContainer staggerDelay={0.05} className="space-y-3">
                  {spmb.persyaratan.split("\n").filter(Boolean).map((line, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#c9a84c] shrink-0 mt-0.5" />
                        <p className="text-foreground/80 leading-relaxed">{line.replace(/^\d+\.\s*/, "")}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </AnimatedSection>
          )}

          {/* CTA with pulse when active */}
          {spmb.link_pendaftaran && spmb.is_active && (
            <AnimatedSection variant="scaleIn">
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5298] rounded-xl p-8 text-white text-center relative overflow-hidden">
                {/* Decorative animated circles */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#c9a84c] pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white pointer-events-none"
                />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Siap Mendaftar?</h2>
                  <p className="text-blue-100 mb-6">Klik tombol di bawah untuk mengakses portal pendaftaran online.</p>
                  <a href={spmb.link_pendaftaran} target="_blank" rel="noopener noreferrer">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      <Button size="lg" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold rounded-full px-10 shadow-xl gap-2">
                        Daftar Sekarang <ExternalLink size={18} />
                      </Button>
                    </motion.div>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}
