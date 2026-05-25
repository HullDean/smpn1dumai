import { motion } from "framer-motion";
import { useGetProfil } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, BookOpen, Users, School } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/animation";

export default function Profil() {
  const { data: profil, isLoading } = useGetProfil();

  if (isLoading) return (
    <div className="py-16 container mx-auto px-4 space-y-6">
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
    </div>
  );

  return (
    <div>
      {/* Hero */}
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
            Tentang Kami
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {profil?.nama_sekolah || "SMP Negeri 1 Dumai"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-2xl mx-auto"
          >
            Berdiri sejak {profil?.tahun_berdiri || "1964"} — Sekolah Unggulan Kota Dumai
          </motion.p>
          {profil?.akreditasi && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Badge className="mt-4 bg-[#c9a84c] text-white text-base px-5 py-2 rounded-full font-bold shadow-lg">
                Akreditasi {profil.akreditasi}
              </Badge>
            </motion.div>
          )}
        </div>
      </div>

      {/* Info Singkat */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <School size={36} />, label: "NPSN", value: profil?.npsn || "-" },
              { icon: <Award size={36} />, label: "Akreditasi", value: profil?.akreditasi || "A" },
              { icon: <BookOpen size={36} />, label: "Tahun Berdiri", value: profil?.tahun_berdiri || "1964" },
              { icon: <Users size={36} />, label: "Status", value: "Negeri" },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(30,58,95,0.12)" }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-xl border border-gray-100 bg-white cursor-default group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary group-hover:text-[#c9a84c] group-hover:bg-primary/20 transition-colors duration-200">
                    {item.icon}
                  </div>
                  <div className="font-bold text-lg text-primary">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      {profil?.sambutan_kepsek && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection variant="slideUp">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="shrink-0 text-center">
                    <div className="w-36 h-36 bg-gradient-to-br from-[#1e3a5f] to-[#2a5298] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ring-4 ring-[#c9a84c]/30">
                      {profil.foto_kepsek ? (
                        <img
                          src={profil.foto_kepsek}
                          alt="Kepala Sekolah"
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-white text-4xl font-bold">KS</span>
                      )}
                    </div>
                    <p className="font-bold text-primary text-lg">{profil.kepala_sekolah}</p>
                    <p className="text-sm text-muted-foreground">Kepala Sekolah</p>
                  </div>
                  <div>
                    <p className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-2">Sambutan</p>
                    <h2 className="text-3xl font-bold text-primary mb-4">Pesan Kepala Sekolah</h2>
                    <div className="text-foreground/70 leading-relaxed whitespace-pre-line text-lg italic border-l-4 border-[#c9a84c] pl-6">
                      {profil.sambutan_kepsek}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Visi & Misi */}
      <section id="visi-misi" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-2">Arah & Tujuan</p>
            <h2 className="text-3xl font-bold text-primary">Visi & Misi</h2>
          </div>
          <AnimatedSection variant="scaleIn" className="mb-8">
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a5298] rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold text-[#c9a84c] mb-4 uppercase tracking-wide">Visi</h3>
              <p className="text-blue-100 text-lg leading-relaxed">{profil?.visi}</p>
            </div>
          </AnimatedSection>

          {profil?.misi && (
            <AnimatedSection variant="slideUp">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-6 uppercase tracking-wide">Misi</h3>
                <StaggerContainer className="space-y-3">
                  {profil.misi.split("\n").filter(Boolean).map((line, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-[#c9a84c] shrink-0 mt-0.5" />
                        <p className="text-foreground/80 leading-relaxed">{line.replace(/^\d+\.\s*/, "")}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Sejarah */}
      {profil?.sejarah && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <AnimatedSection variant="slideUp">
              <div className="text-center mb-10">
                <p className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-2">Latar Belakang</p>
                <h2 className="text-3xl font-bold text-primary">Sejarah Singkat</h2>
              </div>
              <p className="text-foreground/70 leading-relaxed text-lg">{profil.sejarah}</p>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Identitas Sekolah */}
      <section id="struktur" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <AnimatedSection variant="slideUp">
            <div className="text-center mb-10">
              <p className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-2">Data Resmi</p>
              <h2 className="text-3xl font-bold text-primary">Identitas Sekolah</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {[
                ["Nama Sekolah", profil?.nama_sekolah],
                ["NPSN", profil?.npsn],
                ["Akreditasi", profil?.akreditasi],
                ["Tahun Berdiri", profil?.tahun_berdiri],
                ["Kepala Sekolah", profil?.kepala_sekolah],
                ["Alamat", profil?.alamat],
                ["Telepon", profil?.telepon],
                ["Email", profil?.email],
                ["Website", profil?.website],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} px-6 py-4 hover:bg-primary/5 transition-colors duration-150`}
                >
                  <span className="font-semibold text-primary w-48 shrink-0">{label}</span>
                  <span className="text-foreground/80">{value || "-"}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
