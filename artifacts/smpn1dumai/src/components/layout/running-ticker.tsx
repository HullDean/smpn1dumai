import { useState, useEffect } from "react";
import { Bell, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { useListPengumuman, useGetStatistik } from "@workspace/api-client-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function RunningTicker() {
  const { data: pengumuman } = useListPengumuman();
  const { data: stats } = useGetStatistik();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activePengumuman = pengumuman?.filter(p => p.is_active) || [];

  return (
    <div className="bg-[#1e3a5f] text-white text-xs sm:text-sm">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between py-2 gap-2">
        
        <div className="flex-1 flex items-center overflow-hidden w-full relative">
          <div className="bg-accent text-accent-foreground px-3 py-1 font-semibold rounded-sm flex items-center gap-2 shrink-0 z-10">
            <Bell size={14} className="animate-pulse" />
            <span className="hidden sm:inline">Info Terbaru</span>
          </div>
          
          <div className="flex-1 overflow-hidden relative ml-3 h-6 flex items-center">
            {activePengumuman.length > 0 ? (
              <div className="animate-marquee whitespace-nowrap absolute">
                {activePengumuman.map((item) => (
                  <span key={item.id} className="mx-8 flex-inline items-center">
                    <span className="text-accent mr-2">•</span>
                    <Link href={`/pengumuman`} className="hover:text-accent transition-colors">
                      {item.judul}
                    </Link>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-blue-200 italic ml-4">Tidak ada pengumuman saat ini</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-blue-100 font-medium">
          <div className="hidden lg:flex items-center gap-1.5">
            <Users size={14} />
            <span>Pengunjung: {stats?.pengunjung_hari_ini || 0} hari ini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{format(time, "EEEE, dd MMMM yyyy HH:mm", { locale: id })}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
