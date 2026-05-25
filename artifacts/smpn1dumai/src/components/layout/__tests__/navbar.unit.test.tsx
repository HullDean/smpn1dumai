/**
 * Unit tests untuk komponen Navbar
 *
 * Persyaratan: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

// Mock framer-motion to avoid browser animation API dependencies
vi.mock("framer-motion", () => {
  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            className,
            style,
            layoutId,
            variants,
            initial,
            animate,
            exit,
            transition,
            ...rest
          }: {
            children?: React.ReactNode;
            className?: string;
            style?: React.CSSProperties;
            layoutId?: string;
            variants?: unknown;
            initial?: unknown;
            animate?: unknown;
            exit?: unknown;
            transition?: unknown;
            [key: string]: unknown;
          },
          ref: React.Ref<HTMLDivElement>
        ) => (
          <div
            ref={ref}
            className={className}
            style={style}
            data-testid={layoutId ? `motion-${layoutId}` : "motion-div"}
            data-layout-id={layoutId}
            {...rest}
          >
            {children}
          </div>
        )
      ),
    },
    AnimatePresence: ({
      children,
    }: {
      children: React.ReactNode;
    }) => <>{children}</>,
  };
});

// Mock wouter
const mockLocation = vi.fn(() => "/");
vi.mock("wouter", () => ({
  Link: ({
    href,
    children,
    onClick,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
  useLocation: () => [mockLocation(), vi.fn()],
}));

// Mock @workspace/api-client-react
vi.mock("@workspace/api-client-react", () => ({
  useGetProfil: () => ({
    data: {
      nama_sekolah: "SMP Negeri 1 Dumai",
      logo: null,
    },
  }),
}));

// Import after mocks
import { Navbar } from "../navbar";

describe("Navbar", () => {
  beforeEach(() => {
    mockLocation.mockReturnValue("/");
    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Glassmorphism saat scroll", () => {
    it("tidak menerapkan class glassmorphism saat belum di-scroll (scrollY = 0)", () => {
      render(<Navbar />);
      const header = screen.getByRole("banner");
      expect(header).not.toHaveClass("backdrop-blur-md");
      expect(header).not.toHaveClass("bg-white/90");
      expect(header).not.toHaveClass("shadow-md");
    });

    it("menerapkan class glassmorphism saat scrolled > 20px", () => {
      render(<Navbar />);
      const header = screen.getByRole("banner");

      act(() => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 21,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(header).toHaveClass("backdrop-blur-md");
      expect(header).toHaveClass("bg-white/90");
      expect(header).toHaveClass("shadow-md");
    });

    it("menerapkan class glassmorphism tepat saat scrollY = 21", () => {
      render(<Navbar />);
      const header = screen.getByRole("banner");

      act(() => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 21,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(header).toHaveClass("backdrop-blur-md");
    });

    it("tidak menerapkan glassmorphism saat scrollY = 20 (batas bawah)", () => {
      render(<Navbar />);
      const header = screen.getByRole("banner");

      act(() => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 20,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(header).not.toHaveClass("backdrop-blur-md");
    });

    it("menghapus class glassmorphism saat scroll kembali ke atas", () => {
      render(<Navbar />);
      const header = screen.getByRole("banner");

      // Scroll down
      act(() => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 100,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(header).toHaveClass("backdrop-blur-md");

      // Scroll back up
      act(() => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 0,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(header).not.toHaveClass("backdrop-blur-md");
    });
  });

  describe("Dropdown navigasi saat hover", () => {
    it("tidak menampilkan dropdown Profil secara default", () => {
      render(<Navbar />);
      expect(screen.queryByText("Tentang Sekolah")).not.toBeInTheDocument();
    });

    it("menampilkan dropdown Profil saat mouseEnter", () => {
      render(<Navbar />);
      const profilButton = screen.getByRole("button", { name: /profil/i });
      const profilWrapper = profilButton.closest(".relative");

      fireEvent.mouseEnter(profilWrapper!);

      expect(screen.getByText("Tentang Sekolah")).toBeInTheDocument();
      expect(screen.getByText("Visi & Misi")).toBeInTheDocument();
      expect(screen.getByText("Struktur Organisasi")).toBeInTheDocument();
    });

    it("menyembunyikan dropdown Profil saat mouseLeave", () => {
      render(<Navbar />);
      const profilButton = screen.getByRole("button", { name: /profil/i });
      const profilWrapper = profilButton.closest(".relative");

      fireEvent.mouseEnter(profilWrapper!);
      expect(screen.getByText("Tentang Sekolah")).toBeInTheDocument();

      fireEvent.mouseLeave(profilWrapper!);
      expect(screen.queryByText("Tentang Sekolah")).not.toBeInTheDocument();
    });

    it("menampilkan dropdown Kesiswaan saat mouseEnter", () => {
      render(<Navbar />);
      const kesiswaanButton = screen.getByRole("button", { name: /kesiswaan/i });
      const kesiswaanWrapper = kesiswaanButton.closest(".relative");

      fireEvent.mouseEnter(kesiswaanWrapper!);

      expect(screen.getByText("Ekstrakurikuler")).toBeInTheDocument();
      expect(screen.getByText("Prestasi")).toBeInTheDocument();
    });

    it("menampilkan dropdown Publikasi saat mouseEnter", () => {
      render(<Navbar />);
      const publikasiButton = screen.getByRole("button", { name: /publikasi/i });
      const publikasiWrapper = publikasiButton.closest(".relative");

      fireEvent.mouseEnter(publikasiWrapper!);

      expect(screen.getByText("Berita & Artikel")).toBeInTheDocument();
      expect(screen.getByText("Galeri Foto")).toBeInTheDocument();
      expect(screen.getByText("Pengumuman")).toBeInTheDocument();
    });

    it("hanya menampilkan satu dropdown pada satu waktu", () => {
      render(<Navbar />);
      const profilButton = screen.getByRole("button", { name: /profil/i });
      const profilWrapper = profilButton.closest(".relative");
      const kesiswaanButton = screen.getByRole("button", { name: /kesiswaan/i });
      const kesiswaanWrapper = kesiswaanButton.closest(".relative");

      fireEvent.mouseEnter(profilWrapper!);
      expect(screen.getByText("Tentang Sekolah")).toBeInTheDocument();
      expect(screen.queryByText("Ekstrakurikuler")).not.toBeInTheDocument();

      fireEvent.mouseLeave(profilWrapper!);
      fireEvent.mouseEnter(kesiswaanWrapper!);
      expect(screen.queryByText("Tentang Sekolah")).not.toBeInTheDocument();
      expect(screen.getByText("Ekstrakurikuler")).toBeInTheDocument();
    });
  });

  describe("Mobile menu toggle", () => {
    it("tidak menampilkan mobile menu secara default", () => {
      render(<Navbar />);
      // Mobile menu links should not be visible
      expect(screen.queryByText("Profil Sekolah")).not.toBeInTheDocument();
    });

    it("membuka mobile menu saat klik tombol hamburger", () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", { name: /buka menu/i });

      fireEvent.click(hamburgerButton);

      expect(screen.getByText("Profil Sekolah")).toBeInTheDocument();
      expect(screen.getByText("Direktori Guru")).toBeInTheDocument();
    });

    it("menutup mobile menu saat klik tombol X", () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", { name: /buka menu/i });

      // Open menu
      fireEvent.click(hamburgerButton);
      expect(screen.getByText("Profil Sekolah")).toBeInTheDocument();

      // Close menu
      const closeButton = screen.getByRole("button", { name: /tutup menu/i });
      fireEvent.click(closeButton);

      expect(screen.queryByText("Profil Sekolah")).not.toBeInTheDocument();
    });

    it("menutup mobile menu saat klik link navigasi", () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", { name: /buka menu/i });

      fireEvent.click(hamburgerButton);
      expect(screen.getByText("Profil Sekolah")).toBeInTheDocument();

      // Click a nav link
      fireEvent.click(screen.getByText("Profil Sekolah"));

      expect(screen.queryByText("Profil Sekolah")).not.toBeInTheDocument();
    });

    it("menampilkan semua link navigasi di mobile menu", () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", { name: /buka menu/i });

      fireEvent.click(hamburgerButton);

      expect(screen.getByText("Profil Sekolah")).toBeInTheDocument();
      expect(screen.getByText("Direktori Guru")).toBeInTheDocument();
      expect(screen.getByText("Ekstrakurikuler")).toBeInTheDocument();
      expect(screen.getByText("Prestasi")).toBeInTheDocument();
      expect(screen.getByText("Berita")).toBeInTheDocument();
      expect(screen.getByText("Galeri")).toBeInTheDocument();
      expect(screen.getByText("Pengumuman")).toBeInTheDocument();
      // Kontak appears in both desktop and mobile nav, use getAllByText
      expect(screen.getAllByText("Kontak").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Indikator aktif pada route", () => {
    it("menampilkan indikator aktif pada Beranda saat route = /", () => {
      mockLocation.mockReturnValue("/");
      render(<Navbar />);

      const activeIndicator = screen.queryByTestId("motion-activeIndicator");
      expect(activeIndicator).toBeInTheDocument();
    });

    it("tidak menampilkan indikator aktif pada Beranda saat route bukan /", () => {
      mockLocation.mockReturnValue("/profil");
      render(<Navbar />);

      // The active indicator should not be on Beranda link
      // We check by looking at the NavLink for Beranda
      const berandaLink = screen.getByRole("link", { name: /beranda/i });
      const indicator = berandaLink.querySelector('[data-layout-id="activeIndicator"]');
      expect(indicator).not.toBeInTheDocument();
    });

    it("menampilkan indikator aktif pada Direktori saat route = /direktori/guru", () => {
      mockLocation.mockReturnValue("/direktori/guru");
      render(<Navbar />);

      const activeIndicator = screen.queryByTestId("motion-activeIndicator");
      expect(activeIndicator).toBeInTheDocument();
    });

    it("menampilkan indikator aktif pada Kontak saat route = /kontak", () => {
      mockLocation.mockReturnValue("/kontak");
      render(<Navbar />);

      const activeIndicator = screen.queryByTestId("motion-activeIndicator");
      expect(activeIndicator).toBeInTheDocument();
    });

    it("tombol Profil memiliki class text-primary saat route dimulai dengan /profil", () => {
      mockLocation.mockReturnValue("/profil");
      render(<Navbar />);

      const profilButton = screen.getByRole("button", { name: /profil/i });
      expect(profilButton).toHaveClass("text-primary");
    });

    it("tombol Kesiswaan memiliki class text-primary saat route = /ekskul", () => {
      mockLocation.mockReturnValue("/ekskul");
      render(<Navbar />);

      const kesiswaanButton = screen.getByRole("button", { name: /kesiswaan/i });
      expect(kesiswaanButton).toHaveClass("text-primary");
    });

    it("tombol Publikasi memiliki class text-primary saat route = /berita", () => {
      mockLocation.mockReturnValue("/berita");
      render(<Navbar />);

      const publikasiButton = screen.getByRole("button", { name: /publikasi/i });
      expect(publikasiButton).toHaveClass("text-primary");
    });
  });

  describe("Konten Navbar", () => {
    it("menampilkan nama sekolah", () => {
      render(<Navbar />);
      expect(screen.getByText("SMP Negeri 1 Dumai")).toBeInTheDocument();
    });

    it("menampilkan tombol Info SPMB di desktop nav", () => {
      render(<Navbar />);
      // There should be at least one "Info SPMB" button/link
      const spmbLinks = screen.getAllByText("Info SPMB");
      expect(spmbLinks.length).toBeGreaterThan(0);
    });

    it("menampilkan semua item navigasi desktop", () => {
      render(<Navbar />);
      expect(screen.getByRole("link", { name: /beranda/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /profil/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /direktori/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /kesiswaan/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /publikasi/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /kontak/i })).toBeInTheDocument();
    });
  });
});
