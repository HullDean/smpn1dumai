import { Link, useParams } from "wouter";
import { useGetBeritaById, useGetBeritaTerbaru } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, User, ArrowLeft, ArrowRight, BookOpen, Share2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

function BeritaDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-64 md:h-80 bg-gray-200 animate-pulse" />
      <div className="container mx-auto px-4 max-w-3xl py-10 space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-3/4" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="pt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BeritaDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: berita, isLoading, isError } = useGetBeritaById(Number(id));
  const { data: beritaTerbaru } = useGetBeritaTerbaru();

  // Related articles — exclude current, take up to 3
  const related = (beritaTerbaru ?? [])
    .filter((b) => b.id !== Number(id))
    .slice(0, 3);

  if (isLoading) return <BeritaDetailSkeleton />;

  if (isError || !berita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={36} className="text-primary/30" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Berita tidak ditemukan</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Berita yang Anda cari mungkin telah dihapus atau tidak tersedia.
          </p>
          <Link href="/berita">
            <Button className="bg-primary text-white rounded-full gap-2">
              <ArrowLeft size={16} /> Kembali ke Berita
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = berita.created_at
    ? new Date(berita.created_at).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: berita.judul ?? "", url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      {berita.gambar && (
        <div className="relative h-64 md:h-[420px] overflow-hidden bg-primary/10">
          <img
            src={berita.gambar}
            alt={berita.judul ?? ""}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }}
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <div className="pt-8 pb-2">
          <Link href="/berita">
            <Button variant="ghost" className="text-primary gap-2 hover:bg-primary/10 pl-0 -ml-2">
              <ArrowLeft size={16} /> Kembali ke Berita
            </Button>
          </Link>
        </div>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-10"
        >
          <div className="p-6 md:p-10">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {berita.kategori && (
                <Badge className="bg-primary/10 text-primary font-semibold text-xs px-3 py-1 rounded-full">
                  {berita.kategori}
                </Badge>
              )}
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye size={12} />
                {(berita.dilihat ?? 0).toLocaleString()} dilihat
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-6 leading-tight">
              {berita.judul}
            </h1>

            {/* Author & date row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {(berita.penulis ?? "A").charAt(0).toUpperCase()}
                  </div>
                  {berita.penulis}
                </span>
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formattedDate}
                  </span>
                )}
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary/30"
                aria-label="Bagikan artikel"
              >
                <Share2 size={13} /> Bagikan
              </button>
            </div>

            {/* Content */}
            <div className="prose prose-blue max-w-none text-foreground/80 leading-relaxed text-base md:text-[17px] whitespace-pre-line">
              {berita.konten}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-10 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              Diterbitkan oleh <span className="font-semibold text-foreground">{berita.penulis}</span>
            </div>
            <Link href="/berita">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full gap-1.5 text-xs font-semibold">
                Berita Lainnya <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
        </motion.article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-black text-primary">Berita Terkait</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/berita/${item.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group h-full"
                  >
                    <div className="h-36 overflow-hidden bg-gray-100">
                      {item.gambar ? (
                        <img
                          src={item.gambar}
                          alt={item.judul ?? ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30">
                          <BookOpen size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <Badge className="bg-primary/10 text-primary text-[10px] font-semibold mb-2 px-2 py-0.5">
                        {item.kategori}
                      </Badge>
                      <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                          : ""}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
