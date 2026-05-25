import { Route, Switch, useLocation } from "wouter";
import { Building2, FileText, Image as ImageIcon, Users, LayoutDashboard, Target, Trophy, LogOut, Bell, Info } from "lucide-react";
import { useAdminLogout } from "@workspace/api-client-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const logout = useAdminLogout();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    logout.mutate(undefined, {
      onSettled: () => {
        setLocation("/admin");
      }
    });
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/profil", label: "Profil Sekolah", icon: <Building2 size={20} /> },
    { href: "/admin/berita", label: "Kelola Berita", icon: <FileText size={20} /> },
    { href: "/admin/guru", label: "Kelola Guru", icon: <Users size={20} /> },
    { href: "/admin/galeri", label: "Kelola Galeri", icon: <ImageIcon size={20} /> },
    { href: "/admin/prestasi", label: "Kelola Prestasi", icon: <Trophy size={20} /> },
    { href: "/admin/ekskul", label: "Kelola Ekskul", icon: <Target size={20} /> },
    { href: "/admin/pengumuman", label: "Pengumuman", icon: <Bell size={20} /> },
    { href: "/admin/spmb", label: "Info SPMB", icon: <Info size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#1e3a5f] text-white hidden md:flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center justify-center border-b border-white/10 font-bold text-xl tracking-tight">
          SMPN 1 Admin
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => setLocation(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      active 
                        ? "bg-accent text-accent-foreground font-medium" 
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="font-semibold text-lg text-gray-800">
            {navItems.find(n => n.href === location)?.label || "Admin Panel"}
          </h1>
        </header>
        <div className="p-6 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
