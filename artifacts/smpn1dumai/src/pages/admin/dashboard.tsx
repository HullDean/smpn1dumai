import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  FileText, Users, Image, Trophy, Eye, Bell, Layers, Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useGetAdminDashboard();

  const stats = [
    { label: "Total Berita", value: data?.total_berita ?? 0, icon: <FileText size={22} />, color: "bg-blue-50 text-blue-700", link: "/admin/berita" },
    { label: "Total Guru", value: data?.total_guru ?? 0, icon: <Users size={22} />, color: "bg-green-50 text-green-700", link: "/admin/guru" },
    { label: "Total Galeri", value: data?.total_galeri ?? 0, icon: <Image size={22} />, color: "bg-purple-50 text-purple-700", link: "/admin/galeri" },
    { label: "Total Prestasi", value: data?.total_prestasi ?? 0, icon: <Trophy size={22} />, color: "bg-amber-50 text-amber-700", link: "/admin/prestasi" },
    { label: "Pengunjung Hari Ini", value: data?.pengunjung_hari_ini ?? 0, icon: <Eye size={22} />, color: "bg-rose-50 text-rose-700", link: null },
    { label: "Total Pengunjung", value: data?.total_pengunjung ?? 0, icon: <Eye size={22} />, color: "bg-indigo-50 text-indigo-700", link: null },
    { label: "Pengumuman", value: data?.total_berita ?? 0, icon: <Bell size={22} />, color: "bg-yellow-50 text-yellow-700", link: "/admin/pengumuman" },
    { label: "Galeri Foto", value: data?.total_galeri ?? 0, icon: <Layers size={22} />, color: "bg-teal-50 text-teal-700", link: "/admin/galeri" },
  ];

  const quickLinks = [
    { href: "/admin/berita", label: "Tambah Berita", icon: <FileText size={18} /> },
    { href: "/admin/guru", label: "Tambah Guru", icon: <Users size={18} /> },
    { href: "/admin/galeri", label: "Tambah Foto Galeri", icon: <Image size={18} /> },
    { href: "/admin/pengumuman", label: "Tambah Pengumuman", icon: <Bell size={18} /> },
    { href: "/admin/prestasi", label: "Tambah Prestasi", icon: <Trophy size={18} /> },
    { href: "/admin/slider", label: "Kelola Slider", icon: <Layers size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Selamat Datang di Panel Admin</h2>
        <p className="text-muted-foreground">Kelola konten website SMPN 1 Dumai dari sini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          isLoading ? (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ) : (
            <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all ${s.link ? "cursor-pointer" : ""}`}
              onClick={() => s.link && (window.location.href = s.link)}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800">{s.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          )
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((ql, i) => (
              <Link key={i} href={ql.href}>
                <div className="flex items-center gap-2.5 p-3.5 bg-primary/5 hover:bg-primary/10 rounded-lg text-primary font-medium text-sm transition-colors cursor-pointer border border-primary/10">
                  {ql.icon} {ql.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Berita */}
        {data?.berita_terbaru && data.berita_terbaru.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Berita Terbaru</h3>
              <Link href="/admin/berita">
                <span className="text-primary text-sm font-medium hover:underline">Kelola</span>
              </Link>
            </div>
            <div className="space-y-3">
              {data.berita_terbaru.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{b.judul}</p>
                    <p className="text-xs text-muted-foreground">{b.kategori}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${b.is_published ? "bg-green-500" : "bg-gray-300"}`} title={b.is_published ? "Diterbitkan" : "Draft"} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
