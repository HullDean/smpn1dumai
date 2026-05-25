import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListBerita } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Eye } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animation";

const CATEGORIES = ["Semua", "Prestasi", "Kegiatan", "Pengumuman", "Akademik"];

export default function Berita() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const { data: berita, isLoading } = useListBerita({ kategori: kategori === "Semua" ? undefined : kategori });

  const filtered = (berita?.data ?? []).filter((b) => {
    if (!search) return true;
    return b.judul?.toLowerCase().includes(search.toLowerCase()) || b.konten?.toLowerCase().includes(search.toLowerCase());
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

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
            Informasi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Berita & Artikel
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Informasi terkini seputar kegiatan, prestasi, dan pengumuman SMPN 1 Dumai.
          </motion.p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
                className="pl-10 h-12 bg-white border-gray-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setKategori(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    kategori === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-foreground/80 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-8">
              Menampilkan <span className="font-semibold text-primary">{filtered.length}</span> berita
              {search && <> untuk "<span className="font-semibold">{search}</span>"</>}
            </p>
          )}

          {isLoading ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                <Skeleton className="h-64 md:w-2/5 shrink-0" />
                <div className="p-6 flex-1 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <BookOpen size={40} className="text-primary/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Tidak ada berita ditemukan</h3>
              <p className="text-muted-foreground text-sm">Coba kata kunci atau kategori yang berbeda</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${kategori}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Featured card */}
                {featured && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                  >
                    <Link href={`/berita/${featured.id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 flex flex-col md:flex-row">
                        <div className="h-64 md:h-auto md:w-2/5 overflow-hidden bg-gray-100 shrink-0">
                          {featured.gambar ? (
                            <img
                              src={featured.gambar}
                              alt={featured.judul ?? ""}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                              <BookOpen size={56} />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col justify-center flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-[#c9a84c] text-white text-xs font-semibold">Featured</Badge>
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-medium">
                              {featured.kategori}
                            </Badge>
                          </div>
                          <h2 className="font-bold text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3">
                            {featured.judul}
                          </h2>
                          {featured.konten && (
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{featured.konten}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{featured.penulis}</span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {featured.dilihat ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Rest of articles */}
                {rest.length > 0 && (
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((item) => (
                      <StaggerItem key={item.id}>
                        <Link href={`/berita/${item.id}`}>
                          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 h-full flex flex-col">
                            <div className="h-48 overflow-hidden bg-gray-100 relative shrink-0">
                              {item.gambar ? (
                                <img
                                  src={item.gambar}
                                  alt={item.judul ?? ""}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                  <BookOpen size={48} />
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-white/90 text-primary text-xs font-semibold backdrop-blur-sm shadow-sm">{item.kategori}</Badge>
                              </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                              <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-1 leading-snug mb-3">
                                {item.judul}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-gray-50">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <Eye size={11} /> {item.dilihat ?? 0}
                                </span>
                                <span>{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
