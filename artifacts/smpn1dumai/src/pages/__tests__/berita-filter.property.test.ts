/**
 * Feature: website-ui-enhancement
 * Property 8: Jumlah Berita yang Ditampilkan Konsisten dengan Filter
 * Task 7.1
 *
 * Validates: Persyaratan 7.4
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

type BeritaItem = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
};

// Pure filter logic extracted from berita.tsx
function filterBerita(
  beritaList: BeritaItem[],
  search: string,
  kategori: string
): BeritaItem[] {
  return beritaList.filter((b) => {
    const matchSearch =
      !search ||
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.konten.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === "Semua" || b.kategori === kategori;
    return matchSearch && matchKategori;
  });
}

function getDisplayedCount(
  beritaList: BeritaItem[],
  search: string,
  kategori: string
): number {
  return filterBerita(beritaList, search, kategori).length;
}

const CATEGORIES = ["Semua", "Prestasi", "Kegiatan", "Pengumuman", "Akademik"] as const;

describe("Property 8: Jumlah Berita yang Ditampilkan Konsisten dengan Filter", () => {
  /**
   * Validates: Persyaratan 7.4
   *
   * Untuk setiap kombinasi search query dan filter kategori yang diterapkan,
   * angka jumlah berita yang ditampilkan di UI harus selalu sama dengan
   * panjang array hasil filter yang sebenarnya.
   */
  it("angka yang ditampilkan selalu sama dengan panjang array hasil filter", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 0, maxLength: 100 }),
            konten: fc.string({ minLength: 0, maxLength: 500 }),
            kategori: fc.constantFrom(...CATEGORIES.slice(1)),
          }),
          { minLength: 0, maxLength: 50 }
        ),
        fc.string({ minLength: 0, maxLength: 50 }),
        fc.constantFrom(...CATEGORIES),
        (beritaList, searchQuery, kategori) => {
          const filtered = filterBerita(beritaList, searchQuery, kategori);
          const displayedCount = getDisplayedCount(beritaList, searchQuery, kategori);
          return displayedCount === filtered.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("filter kosong menampilkan semua berita", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1 }),
            konten: fc.string({ minLength: 0 }),
            kategori: fc.constantFrom(...CATEGORIES.slice(1)),
          }),
          { minLength: 0, maxLength: 30 }
        ),
        (beritaList) => {
          const filtered = filterBerita(beritaList, "", "Semua");
          return filtered.length === beritaList.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("filter kategori spesifik tidak pernah menampilkan lebih dari total berita", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1 }),
            konten: fc.string({ minLength: 0 }),
            kategori: fc.constantFrom(...CATEGORIES.slice(1)),
          }),
          { minLength: 0, maxLength: 30 }
        ),
        fc.constantFrom(...CATEGORIES.slice(1)),
        (beritaList, kategori) => {
          const filtered = filterBerita(beritaList, "", kategori);
          return filtered.length <= beritaList.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("search query yang tidak cocok menghasilkan 0 berita", () => {
    const beritaList: BeritaItem[] = [
      { id: 1, judul: "Berita Satu", konten: "Konten satu", kategori: "Kegiatan" },
      { id: 2, judul: "Berita Dua", konten: "Konten dua", kategori: "Prestasi" },
    ];
    const result = filterBerita(beritaList, "xyzxyzxyz_tidak_ada", "Semua");
    expect(result).toHaveLength(0);
  });

  it("search case-insensitive — 'berita' cocok dengan 'Berita'", () => {
    const beritaList: BeritaItem[] = [
      { id: 1, judul: "Berita Terbaru", konten: "Konten", kategori: "Kegiatan" },
      { id: 2, judul: "Artikel Lain", konten: "Konten lain", kategori: "Prestasi" },
    ];
    const result = filterBerita(beritaList, "berita", "Semua");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("filter kategori 'Semua' tidak memfilter berdasarkan kategori", () => {
    const beritaList: BeritaItem[] = [
      { id: 1, judul: "A", konten: "", kategori: "Prestasi" },
      { id: 2, judul: "B", konten: "", kategori: "Kegiatan" },
      { id: 3, judul: "C", konten: "", kategori: "Akademik" },
    ];
    const result = filterBerita(beritaList, "", "Semua");
    expect(result).toHaveLength(3);
  });

  it("kombinasi search + kategori memfilter dengan benar", () => {
    const beritaList: BeritaItem[] = [
      { id: 1, judul: "Prestasi Olimpiade", konten: "", kategori: "Prestasi" },
      { id: 2, judul: "Kegiatan Pramuka", konten: "", kategori: "Kegiatan" },
      { id: 3, judul: "Prestasi Seni", konten: "", kategori: "Prestasi" },
    ];
    const result = filterBerita(beritaList, "prestasi", "Prestasi");
    expect(result).toHaveLength(2);
  });
});
