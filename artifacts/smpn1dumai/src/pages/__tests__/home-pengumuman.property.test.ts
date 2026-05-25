/**
 * Feature: website-ui-enhancement
 * Property 6: Pengumuman Terbaru Tidak Melebihi 3 Item
 * Task 5.1 & 5.2
 *
 * Validates: Persyaratan 5.3
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Pure logic extracted from home.tsx for testing
function getDisplayedPengumuman(
  pengumumanList: Array<{ id: number; judul: string; is_active: boolean; prioritas: number }>
) {
  return pengumumanList
    .filter((p) => p.is_active)
    .sort((a, b) => b.prioritas - a.prioritas)
    .slice(0, 3);
}

describe("Property 6: Pengumuman Terbaru Tidak Melebihi 3 Item", () => {
  /**
   * Validates: Persyaratan 5.3
   *
   * Untuk setiap jumlah pengumuman aktif yang ada (0, 1, 2, 3, 4, atau lebih),
   * section "Pengumuman Terbaru" di halaman Home harus menampilkan paling banyak 3 item.
   */
  it("tidak pernah menampilkan lebih dari 3 pengumuman untuk input apapun", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1, maxLength: 100 }),
            is_active: fc.boolean(),
            prioritas: fc.integer({ min: 1, max: 3 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (pengumumanList) => {
          const displayed = getDisplayedPengumuman(pengumumanList);
          return displayed.length <= 3;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("menampilkan 0 item jika tidak ada pengumuman aktif", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1 }),
            is_active: fc.constant(false),
            prioritas: fc.integer({ min: 1, max: 3 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (pengumumanList) => {
          const displayed = getDisplayedPengumuman(pengumumanList);
          return displayed.length === 0;
        }
      ),
      { numRuns: 50 }
    );
  });

  it("menampilkan tepat min(aktif, 3) item", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1 }),
            is_active: fc.boolean(),
            prioritas: fc.integer({ min: 1, max: 3 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (pengumumanList) => {
          const activeCount = pengumumanList.filter((p) => p.is_active).length;
          const displayed = getDisplayedPengumuman(pengumumanList);
          return displayed.length === Math.min(activeCount, 3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("semua item yang ditampilkan berstatus aktif", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1 }),
            is_active: fc.boolean(),
            prioritas: fc.integer({ min: 1, max: 3 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (pengumumanList) => {
          const displayed = getDisplayedPengumuman(pengumumanList);
          return displayed.every((p) => p.is_active);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("item diurutkan berdasarkan prioritas tertinggi ke terendah", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            judul: fc.string({ minLength: 1 }),
            is_active: fc.constant(true),
            prioritas: fc.integer({ min: 1, max: 3 }),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        (pengumumanList) => {
          const displayed = getDisplayedPengumuman(pengumumanList);
          for (let i = 0; i < displayed.length - 1; i++) {
            if (displayed[i].prioritas < displayed[i + 1].prioritas) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Unit: Home — Pengumuman Terbaru", () => {
  it("tidak menampilkan section jika tidak ada pengumuman aktif", () => {
    const result = getDisplayedPengumuman([
      { id: 1, judul: "Test", is_active: false, prioritas: 3 },
      { id: 2, judul: "Test 2", is_active: false, prioritas: 2 },
    ]);
    expect(result).toHaveLength(0);
  });

  it("menampilkan maksimal 3 pengumuman dari 5 yang aktif", () => {
    const result = getDisplayedPengumuman([
      { id: 1, judul: "A", is_active: true, prioritas: 1 },
      { id: 2, judul: "B", is_active: true, prioritas: 2 },
      { id: 3, judul: "C", is_active: true, prioritas: 3 },
      { id: 4, judul: "D", is_active: true, prioritas: 1 },
      { id: 5, judul: "E", is_active: true, prioritas: 2 },
    ]);
    expect(result).toHaveLength(3);
  });

  it("mengurutkan berdasarkan prioritas tertinggi", () => {
    const result = getDisplayedPengumuman([
      { id: 1, judul: "Biasa", is_active: true, prioritas: 1 },
      { id: 2, judul: "Segera", is_active: true, prioritas: 3 },
      { id: 3, judul: "Penting", is_active: true, prioritas: 2 },
    ]);
    expect(result[0].judul).toBe("Segera");
    expect(result[1].judul).toBe("Penting");
    expect(result[2].judul).toBe("Biasa");
  });

  it("mengabaikan pengumuman tidak aktif saat mengurutkan", () => {
    const result = getDisplayedPengumuman([
      { id: 1, judul: "Aktif Biasa", is_active: true, prioritas: 1 },
      { id: 2, judul: "Tidak Aktif Segera", is_active: false, prioritas: 3 },
      { id: 3, judul: "Aktif Penting", is_active: true, prioritas: 2 },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].judul).toBe("Aktif Penting");
    expect(result[1].judul).toBe("Aktif Biasa");
  });

  it("mengembalikan array kosong untuk input kosong", () => {
    const result = getDisplayedPengumuman([]);
    expect(result).toHaveLength(0);
  });
});
