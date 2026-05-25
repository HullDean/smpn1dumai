import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter, useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useEffect, lazy, Suspense, Component, type ReactNode, type ErrorInfo } from "react";

// Layouts
import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLayout } from "@/components/layout/admin-layout";

// Public Pages — lazy loaded for code splitting
const Home = lazy(() => import("@/pages/home"));
const Profil = lazy(() => import("@/pages/profil"));
const DirekturiGuru = lazy(() => import("@/pages/direktori-guru"));
const Berita = lazy(() => import("@/pages/berita"));
const BeritaDetail = lazy(() => import("@/pages/berita-detail"));
const Galeri = lazy(() => import("@/pages/galeri"));
const Prestasi = lazy(() => import("@/pages/prestasi"));
const Ekskul = lazy(() => import("@/pages/ekskul"));
const Pengumuman = lazy(() => import("@/pages/pengumuman"));
const Spmb = lazy(() => import("@/pages/spmb"));
const Kontak = lazy(() => import("@/pages/kontak"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Admin Pages — lazy loaded
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminBerita = lazy(() => import("@/pages/admin/berita"));
const AdminGuru = lazy(() => import("@/pages/admin/guru"));
const AdminGaleri = lazy(() => import("@/pages/admin/galeri"));
const AdminPengumuman = lazy(() => import("@/pages/admin/pengumuman"));
const AdminPrestasi = lazy(() => import("@/pages/admin/prestasi"));
const AdminEkskul = lazy(() => import("@/pages/admin/ekskul"));
const AdminSlider = lazy(() => import("@/pages/admin/slider"));
const AdminProfil = lazy(() => import("@/pages/admin/profil"));
const AdminSpmb = lazy(() => import("@/pages/admin/spmb-admin"));

setAuthTokenGetter(() => localStorage.getItem("admin_token"));

// Aggressive caching: public content is stable, admin data refreshes faster
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 minutes — reduces redundant refetches
      gcTime: 1000 * 60 * 10,     // 10 minutes in cache
      retry: 1,
      refetchOnWindowFocus: false, // prevents refetch on tab switch
    },
  },
});

// ── Error Boundary ────────────────────────────────────────────────────────────
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AppErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-500 text-sm mb-6">
              Halaman mengalami error yang tidak terduga. Silakan muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Page Loader ───────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-xs">Memuat halaman...</p>
    </div>
  </div>
);

// ── Admin Route Guard ─────────────────────────────────────────────────────────
// Extracted as a stable named component to prevent Wouter from unmounting/remounting
// on every render (inline arrow functions create new component references each render).
function AdminRouteGuard({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const { isLoading, isError } = useGetAdminMe({ query: { retry: false, queryKey: getGetAdminMeQueryKey() } });

  useEffect(() => {
    if (!isLoading && isError) {
      setLocation("/admin");
    }
  }, [isLoading, isError, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }
  if (isError) return null;

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

// Stable wrapper components — defined outside Router to avoid re-creation on render
const AdminDashboardRoute = () => <AdminRouteGuard component={AdminDashboard} />;
const AdminBeritaRoute = () => <AdminRouteGuard component={AdminBerita} />;
const AdminGuruRoute = () => <AdminRouteGuard component={AdminGuru} />;
const AdminGaleriRoute = () => <AdminRouteGuard component={AdminGaleri} />;
const AdminPengumumanRoute = () => <AdminRouteGuard component={AdminPengumuman} />;
const AdminPrestasiRoute = () => <AdminRouteGuard component={AdminPrestasi} />;
const AdminEkskulRoute = () => <AdminRouteGuard component={AdminEkskul} />;
const AdminSliderRoute = () => <AdminRouteGuard component={AdminSlider} />;
const AdminProfilRoute = () => <AdminRouteGuard component={AdminProfil} />;
const AdminSpmbRoute = () => <AdminRouteGuard component={AdminSpmb} />;

// ── Router ────────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Admin Routes */}
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboardRoute} />
        <Route path="/admin/berita" component={AdminBeritaRoute} />
        <Route path="/admin/guru" component={AdminGuruRoute} />
        <Route path="/admin/galeri" component={AdminGaleriRoute} />
        <Route path="/admin/pengumuman" component={AdminPengumumanRoute} />
        <Route path="/admin/prestasi" component={AdminPrestasiRoute} />
        <Route path="/admin/ekskul" component={AdminEkskulRoute} />
        <Route path="/admin/slider" component={AdminSliderRoute} />
        <Route path="/admin/profil" component={AdminProfilRoute} />
        <Route path="/admin/spmb" component={AdminSpmbRoute} />

        {/* Public Routes */}
        <Route path="/">
          <PublicLayout><Home /></PublicLayout>
        </Route>
        <Route path="/profil">
          <PublicLayout><Profil /></PublicLayout>
        </Route>
        <Route path="/direktori/guru">
          <PublicLayout><DirekturiGuru /></PublicLayout>
        </Route>
        <Route path="/berita">
          <PublicLayout><Berita /></PublicLayout>
        </Route>
        <Route path="/berita/:id">
          <PublicLayout><BeritaDetail /></PublicLayout>
        </Route>
        <Route path="/galeri">
          <PublicLayout><Galeri /></PublicLayout>
        </Route>
        <Route path="/prestasi">
          <PublicLayout><Prestasi /></PublicLayout>
        </Route>
        <Route path="/ekskul">
          <PublicLayout><Ekskul /></PublicLayout>
        </Route>
        <Route path="/pengumuman">
          <PublicLayout><Pengumuman /></PublicLayout>
        </Route>
        <Route path="/spmb">
          <PublicLayout><Spmb /></PublicLayout>
        </Route>
        <Route path="/kontak">
          <PublicLayout><Kontak /></PublicLayout>
        </Route>
        <Route>
          <PublicLayout><NotFound /></PublicLayout>
        </Route>
      </Switch>
    </Suspense>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
