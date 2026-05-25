import { useLocation } from "wouter";
import { Navbar, Footer, RunningTicker } from "@/components/layout";
import { PageTransition } from "@/components/animation";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <RunningTicker />
      <Navbar />
      <main className="flex-1">
        <PageTransition locationKey={location}>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
