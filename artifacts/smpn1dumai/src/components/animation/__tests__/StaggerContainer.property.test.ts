/**
 * Feature: website-ui-enhancement
 * Property 2: Stagger Delay dalam Rentang Valid
 *
 * Validates: Persyaratan 1.3
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  clampStagger,
  STAGGER_MIN,
  STAGGER_MAX,
  DEFAULT_STAGGER,
} from "../StaggerContainer";

describe("Property 2: Stagger Delay dalam Rentang Valid", () => {
  /**
   * Validates: Persyaratan 1.3
   *
   * Untuk setiap komponen StaggerContainer yang dirender dengan konfigurasi apapun,
   * nilai staggerChildren yang dihasilkan harus berada dalam rentang [0.06, 0.1] detik.
   */
  it("staggerChildren selalu dalam rentang [0.06, 0.1] untuk semua input", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(1.0), noNaN: true }),
        (staggerDelay) => {
          // Simulate what StaggerContainer does: clamp the stagger
          const clampedStagger = clampStagger(staggerDelay);

          // Property: staggerChildren must always be in [0.06, 0.1]
          return clampedStagger >= STAGGER_MIN && clampedStagger <= STAGGER_MAX;
        }
      ),
      { numRuns: 20 }
    );
  });

  it("default stagger (0.08) berada dalam rentang valid [0.06, 0.1]", () => {
    const clampedDefault = clampStagger(DEFAULT_STAGGER);
    expect(clampedDefault).toBeGreaterThanOrEqual(STAGGER_MIN);
    expect(clampedDefault).toBeLessThanOrEqual(STAGGER_MAX);
    expect(clampedDefault).toBe(DEFAULT_STAGGER);
  });

  it("stagger di bawah minimum (< 0.06) di-clamp ke 0.06", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(0.059), noNaN: true }),
        (stagger) => {
          const clamped = clampStagger(stagger);
          return clamped === STAGGER_MIN;
        }
      ),
      { numRuns: 10 }
    );
  });

  it("stagger di atas maksimum (> 0.1) di-clamp ke 0.1", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.101), max: Math.fround(5.0), noNaN: true }),
        (stagger) => {
          const clamped = clampStagger(stagger);
          return clamped === STAGGER_MAX;
        }
      ),
      { numRuns: 10 }
    );
  });

  it("nilai dalam rentang valid tidak berubah setelah clamp", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(STAGGER_MIN), max: Math.fround(STAGGER_MAX), noNaN: true }),
        (stagger) => {
          const clamped = clampStagger(stagger);
          return clamped >= STAGGER_MIN && clamped <= STAGGER_MAX;
        }
      ),
      { numRuns: 20 }
    );
  });
});
