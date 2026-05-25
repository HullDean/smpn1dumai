/**
 * Feature: website-ui-enhancement
 * Property 1: Durasi Animasi Scroll-Trigger dalam Rentang Valid
 *
 * Validates: Persyaratan 1.2
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  clampDuration,
  DURATION_MIN,
  DURATION_MAX,
  DEFAULT_DURATION,
  variantMap,
} from "../AnimatedSection";

describe("Property 1: Durasi Animasi Scroll-Trigger dalam Rentang Valid", () => {
  /**
   * Validates: Persyaratan 1.2
   *
   * Untuk setiap komponen AnimatedSection yang dirender dengan props apapun,
   * nilai transition.duration yang dihasilkan harus berada dalam rentang [0.4, 0.7] detik.
   */
  it("transition.duration selalu dalam rentang [0.4, 0.7] untuk semua kombinasi props", () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: fc.constantFrom(
            "fadeIn" as const,
            "slideUp" as const,
            "slideLeft" as const,
            "slideRight" as const,
            "scaleIn" as const
          ),
          delay: fc.float({ min: Math.fround(0), max: Math.fround(2), noNaN: true }),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(2.0), noNaN: true }),
        }),
        ({ variant: _variant, delay: _delay, duration }) => {
          // Simulate what AnimatedSection does: clamp the duration
          const clampedDuration = clampDuration(duration);

          // Property: duration must always be in [0.4, 0.7]
          return clampedDuration >= DURATION_MIN && clampedDuration <= DURATION_MAX;
        }
      ),
      { numRuns: 20 }
    );
  });

  it("default duration (0.6) berada dalam rentang valid [0.4, 0.7]", () => {
    const clampedDefault = clampDuration(DEFAULT_DURATION);
    expect(clampedDefault).toBeGreaterThanOrEqual(DURATION_MIN);
    expect(clampedDefault).toBeLessThanOrEqual(DURATION_MAX);
  });

  it("duration di bawah minimum (< 0.4) di-clamp ke 0.4", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(0.39), noNaN: true }),
        (duration) => {
          const clamped = clampDuration(duration);
          return clamped === DURATION_MIN;
        }
      ),
      { numRuns: 10 }
    );
  });

  it("duration di atas maksimum (> 0.7) di-clamp ke 0.7", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.71), max: Math.fround(10), noNaN: true }),
        (duration) => {
          const clamped = clampDuration(duration);
          return clamped === DURATION_MAX;
        }
      ),
      { numRuns: 10 }
    );
  });

  it("semua variant yang tersedia terdefinisi dengan benar", () => {
    const expectedVariants = ["fadeIn", "slideUp", "slideLeft", "slideRight", "scaleIn"];
    for (const variant of expectedVariants) {
      expect(variantMap).toHaveProperty(variant);
      expect(variantMap[variant as keyof typeof variantMap]).toHaveProperty("initial");
      expect(variantMap[variant as keyof typeof variantMap]).toHaveProperty("animate");
    }
  });

  it("semua variant hanya menggunakan properti GPU-compositable (opacity, x, y, scale)", () => {
    const forbiddenProps = ["width", "height", "top", "left", "right", "bottom"];

    for (const [variantName, { initial, animate }] of Object.entries(variantMap)) {
      for (const prop of forbiddenProps) {
        expect(
          Object.keys(initial),
          `Variant "${variantName}" initial tidak boleh menggunakan "${prop}"`
        ).not.toContain(prop);
        expect(
          Object.keys(animate),
          `Variant "${variantName}" animate tidak boleh menggunakan "${prop}"`
        ).not.toContain(prop);
      }
    }
  });
});
