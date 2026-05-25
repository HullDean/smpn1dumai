import { useState } from "react";
import { motion } from "framer-motion";
import { useListGuru } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animation";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

const COLORS = [
  "from-[#1e3a5f] to-[#2a5298]",
  "from-[#2a5298] to-[#1e3a5f]",
  "from-[#1e3a5f] to-[#c9a84c]",
  "from-[#0f2942] to-[#1e3a5f]",
];

export default function DirekturiGuru() {
  const { data: gurus, isLoading } = useListGuru();
  const [search, setSearch] = useState("");
  const [filterMapel, setFilterMapel] = useState("Semua");

  const activeGurus = gurus?.filter((g) => g.is_active) ?? [];
  const mapelOptions = ["Semua", ...Array.from(new Set(activeGurus.map((g) => g.mata_pelajaran).filter(Boolean)))];

  const filtered = activeGurus.filter((g) => {
    const matchSearch = !search || [g.nama, g.mata_pelajaran, g.jabatan, g.nip]
      .some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    const matchMapel = filterMapel === "Semua" || g.mata_pelajaran === filterMapel;
    return matchSearch && matchMapel;
  });

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
            Tim Pengajar
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Direktori Guru & Staff
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Tenaga pendidik profesional dan berdedikasi tinggi dalam membimbing peserta didik.
          </motion.p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari nama, mata pelajaran, atau NIP..."
                className="pl-10 h-12 bg-white border-gray-200 text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {mapelOptions.slice(0, 8).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMapel(m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    filterMapel === m
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-foreground/80 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Users size={16} />
            <span>Menampilkan {filtered.length} dari {activeGurus.length} pendidik</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Tidak ada pendidik yang sesuai pencarian.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((guru, i) => (
                <StaggerItem key={guru.id}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group h-full"
                  >
                    <div className={`h-36 bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center relative overflow-hidden`}>
                      {guru.foto ? (
                        <img
                          src={guru.foto}
                          alt={guru.nama ?? ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <span className="text-4xl font-bold text-white/80">{initials(guru.nama ?? "GR")}</span>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#1e3a5f]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                        {guru.mata_pelajaran && (
                          <p className="text-white font-bold text-sm">{guru.mata_pelajaran}</p>
                        )}
                        {guru.jabatan && (
                          <p className="text-[#c9a84c] text-xs mt-1">{guru.jabatan}</p>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground leading-tight text-base group-hover:text-primary transition-colors">
                        {guru.nama}
                      </h3>
                      {guru.nip && (
                        <p className="text-xs text-muted-foreground mt-1">NIP: {guru.nip}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {guru.mata_pelajaran && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {guru.mata_pelajaran}
                          </Badge>
                        )}
                        {guru.jabatan && guru.jabatan !== "Guru" && (
                          <Badge variant="secondary" className="bg-[#c9a84c]/20 text-foreground text-xs">
                            {guru.jabatan}
                          </Badge>
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
