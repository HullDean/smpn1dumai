import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetProfil } from "@workspace/api-client-react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Clock } from "lucide-react";

export function Footer() {
  const { data: profil } = useGetProfil();

  return (
    <footer className="bg-[#1e3a5f] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              {profil?.logo ? (
                <img src={profil.logo} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
              ) : (
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  S1
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg leading-tight uppercase">
                  {profil?.nama_sekolah || "SMP Negeri 1 Dumai"}
                </h3>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Membentuk generasi yang cerdas, berkarakter, dan berwawasan lingkungan untuk masa depan bangsa yang lebih baik.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: <Facebook size={18} />, label: "Facebook" },
                { icon: <Instagram size={18} />, label: "Instagram" },
                { icon: <Youtube size={18} />, label: "YouTube" },
              ].map(({ icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-200 hover:bg-[#c9a84c] hover:text-white hover:shadow-[0_0_12px_rgba(201,168,76,0.5)]"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Tautan Cepat</h4>
            <ul className="space-y-3">
              {[
                { href: "/profil", label: "Profil Sekolah" },
                { href: "/direktori/guru", label: "Direktori Guru & Staff" },
                { href: "/berita", label: "Berita & Artikel" },
                { href: "/prestasi", label: "Prestasi Siswa" },
                { href: "/spmb", label: "Info Pendaftaran (SPMB)" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="group relative text-blue-100 hover:text-[#c9a84c] transition-colors duration-200 inline-flex items-center gap-1">
                    <span className="relative">
                      {label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c9a84c] transition-all duration-200 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Publikasi</h4>
            <ul className="space-y-3">
              {[
                { href: "/pengumuman", label: "Pengumuman" },
                { href: "/galeri", label: "Galeri Foto" },
                { href: "/ekskul", label: "Ekstrakurikuler" },
                { href: "/kontak", label: "Hubungi Kami" },
                { href: "/admin", label: "Login Admin" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="group relative text-blue-100 hover:text-[#c9a84c] transition-colors duration-200 inline-flex items-center gap-1">
                    <span className="relative">
                      {label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c9a84c] transition-all duration-200 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#c9a84c] shrink-0 mt-1" />
                <span className="text-blue-100 text-sm leading-relaxed">
                  {profil?.alamat || "Jl. Pattimura, Laksamana, Dumai Kota, Kota Dumai, Riau 28826"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#c9a84c] shrink-0" />
                <span className="text-blue-100 text-sm">
                  {profil?.telepon || "(0765) XXXXXX"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#c9a84c] shrink-0" />
                <span className="text-blue-100 text-sm break-all">
                  {profil?.email || "info@smpn1dumai.sch.id"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-100 text-sm font-semibold">Jam Operasional</p>
                  <p className="text-blue-200 text-sm">Senin – Sabtu</p>
                  <p className="text-blue-200 text-sm">07.00 – 15.00 WIB</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/20 text-center text-blue-200 text-sm">
          <p>&copy; {new Date().getFullYear()} {profil?.nama_sekolah || "SMP Negeri 1 Dumai"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
