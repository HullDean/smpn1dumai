/**
 * Feature: website-ui-enhancement
 * Property 7: Navigasi Lightbox Tidak Keluar dari Batas
 * Task 8.1 & 8.2
 *
 * Validates: Persyaratan 6.3
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Pure navigation logic extracted from galeri.tsx
function navigateLightbox(currentIndex: number, direction: 1 | -1, totalItems: number): number {
  return (currentIndex + direction + totalItems) % totalItems;
}

function initLightboxIndex(startIndex: number, totalItems: number): number {
  return startIndex % totalItems;
}

describe("Property 7: Navigasi Lightbox Tidak Keluar dari Batas", () => {
  /**
   * Validates: Persyaratan 6.3
   *
   * Untuk setiap koleksi foto dengan N item (N ≥ 1), navigasi next dari item terakhir
   * harus kembali ke item pertama, dan navigasi prev dari item pertama harus kembali
   * ke item terakhir — navigasi bersifat circular dan tidak pernah menghasilkan
   * index di luar [0, N-1].
   */
  it("index selalu dalam [0, N-1] setelah serangkaian navigasi apapun", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 50 }),
        fc.integer({ min: 0, max: 999 }),
        fc.array(fc.constantFrom(1 as const, -1 as const), { minLength: 1, maxLength: 100 }),
        (items, startIndex, actions) => {
          const n = items.length;
          let index = initLightboxIndex(startIndex, n);

          for (const action of actions) {
            index = navigateLightbox(index, action, n);
            if (index < 0 || index >= n) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("navigasi next dari item terakhir kembali ke item pertama (circular)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 50 }),
        (items) => {
          const n = items.length;
          const lastIndex = n - 1;
          const result = navigateLightbox(lastIndex, 1, n);
          return result === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("navigasi prev dari item pertama kembali ke item terakhir (circular)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 50 }),
        (items) => {
          const n = items.length;
          const result = navigateLightbox(0, -1, n);
          return result === n - 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("navigasi next dari item manapun selalu menghasilkan index valid", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 99 }),
        (n, startIdx) => {
          const index = startIdx % n;
          const result = navigateLightbox(index, 1, n);
          return result >= 0 && result < n;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("navigasi prev dari item manapun selalu menghasilkan index valid", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 99 }),
        (n, startIdx) => {
          const index = startIdx % n;
          const result = navigateLightbox(index, -1, n);
          return result >= 0 && result < n;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("navigasi next N kali dari posisi manapun kembali ke posisi awal", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 19 }),
        (items, startIdx) => {
          const n = items.length;
          let index = startIdx % n;
          const start = index;

          for (let i = 0; i < n; i++) {
            index = navigateLightbox(index, 1, n);
          }
          return index === start;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Unit: Lightbox Galeri", () => {
  it("navigasi next dari index 0 ke index 1 pada koleksi 3 item", () => {
    expect(navigateLightbox(0, 1, 3)).toBe(1);
  });

  it("navigasi next dari index 1 ke index 2 pada koleksi 3 item", () => {
    expect(navigateLightbox(1, 1, 3)).toBe(2);
  });

  it("navigasi next dari index 2 (terakhir) ke index 0 pada koleksi 3 item", () => {
    expect(navigateLightbox(2, 1, 3)).toBe(0);
  });

  it("navigasi prev dari index 0 ke index 2 (terakhir) pada koleksi 3 item", () => {
    expect(navigateLightbox(0, -1, 3)).toBe(2);
  });

  it("navigasi prev dari index 2 ke index 1 pada koleksi 3 item", () => {
    expect(navigateLightbox(2, -1, 3)).toBe(1);
  });

  it("koleksi 1 item: next dari 0 kembali ke 0", () => {
    expect(navigateLightbox(0, 1, 1)).toBe(0);
  });

  it("koleksi 1 item: prev dari 0 kembali ke 0", () => {
    expect(navigateLightbox(0, -1, 1)).toBe(0);
  });

  it("initLightboxIndex mengembalikan index valid untuk startIndex besar", () => {
    expect(initLightboxIndex(10, 3)).toBe(1); // 10 % 3 = 1
    expect(initLightboxIndex(9, 3)).toBe(0);  // 9 % 3 = 0
    expect(initLightboxIndex(0, 5)).toBe(0);
  });
});
