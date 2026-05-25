import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfil } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

// Dropdown animation variants
const dropdownVariants = {
  initial: { opacity: 0, y: -8, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.95 },
};

const dropdownTransition = { duration: 0.2, ease: "easeOut" as const };

// Mobile menu animation variants
const mobileMenuVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const { data: profil } = useGetProfil();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-white/95 shadow-lg shadow-black/5 border-b border-gray-100/80"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
          {profil?.logo ? (
            <img src={profil.logo} alt="Logo" className="w-11 h-11 object-contain group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-[#2a5298] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              S1
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-black text-base leading-tight text-primary uppercase tracking-wide">
              {profil?.nama_sekolah || "SMP Negeri 1 Dumai"}
            </span>
            <span className="text-[10px] text-[#c9a84c] font-bold uppercase tracking-widest">
              Terakreditasi A
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
          <NavLink href="/" active={location === "/"}>
            Beranda
          </NavLink>

          {/* Profil Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("profil")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                location.startsWith("/profil") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Profil <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {activeDropdown === "profil" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={dropdownTransition}
                  className="absolute top-full left-0 w-48 bg-white shadow-md border rounded-md py-2 z-50"
                >
                  <DropdownLink href="/profil">Tentang Sekolah</DropdownLink>
                  <DropdownLink href="/profil#visi-misi">Visi &amp; Misi</DropdownLink>
                  <DropdownLink href="/profil#struktur">Struktur Organisasi</DropdownLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink
            href="/direktori/guru"
            active={location.startsWith("/direktori")}
          >
            Direktori
          </NavLink>

          {/* Kesiswaan Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("kesiswaan")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                ["/ekskul", "/prestasi"].some((p) => location.startsWith(p))
                  ? "text-primary"
                  : "text-foreground/80"
              }`}
            >
              Kesiswaan <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {activeDropdown === "kesiswaan" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={dropdownTransition}
                  className="absolute top-full left-0 w-48 bg-white shadow-md border rounded-md py-2 z-50"
                >
                  <DropdownLink href="/ekskul">Ekstrakurikuler</DropdownLink>
                  <DropdownLink href="/prestasi">Prestasi</DropdownLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Publikasi Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("publikasi")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                ["/berita", "/galeri", "/pengumuman"].some((p) =>
                  location.startsWith(p)
                )
                  ? "text-primary"
                  : "text-foreground/80"
              }`}
            >
              Publikasi <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {activeDropdown === "publikasi" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={dropdownTransition}
                  className="absolute top-full left-0 w-48 bg-white shadow-md border rounded-md py-2 z-50"
                >
                  <DropdownLink href="/berita">Berita &amp; Artikel</DropdownLink>
                  <DropdownLink href="/galeri">Galeri Foto</DropdownLink>
                  <DropdownLink href="/pengumuman">Pengumuman</DropdownLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="/kontak" active={location === "/kontak"}>
            Kontak
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/spmb">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-6 shadow-sm">
              Info SPMB
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
            className="lg:hidden bg-white border-t border-border/50 shadow-lg absolute top-full left-0 w-full"
          >
            <div className="p-4 flex flex-col gap-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <MobileNavLink href="/" onClick={closeMenu}>
                Beranda
              </MobileNavLink>
              <MobileNavLink href="/profil" onClick={closeMenu}>
                Profil Sekolah
              </MobileNavLink>
              <MobileNavLink href="/direktori/guru" onClick={closeMenu}>
                Direktori Guru
              </MobileNavLink>
              <MobileNavLink href="/ekskul" onClick={closeMenu}>
                Ekstrakurikuler
              </MobileNavLink>
              <MobileNavLink href="/prestasi" onClick={closeMenu}>
                Prestasi
              </MobileNavLink>
              <MobileNavLink href="/berita" onClick={closeMenu}>
                Berita
              </MobileNavLink>
              <MobileNavLink href="/galeri" onClick={closeMenu}>
                Galeri
              </MobileNavLink>
              <MobileNavLink href="/pengumuman" onClick={closeMenu}>
                Pengumuman
              </MobileNavLink>
              <MobileNavLink href="/kontak" onClick={closeMenu}>
                Kontak
              </MobileNavLink>
              <Link href="/spmb" onClick={closeMenu} className="mt-4">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  Info SPMB
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
        active ? "text-primary font-semibold" : "text-foreground/80"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
          style={{ backgroundColor: "#c9a84c" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

function DropdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-base font-medium rounded-md hover:bg-primary/5 hover:text-primary transition-colors border-b border-border/50 last:border-0"
    >
      {children}
    </Link>
  );
}
