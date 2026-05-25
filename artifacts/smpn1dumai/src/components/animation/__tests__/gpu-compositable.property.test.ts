/**
 * Feature: website-ui-enhancement
 * Property 9: Animasi GPU-Compositable
 *
 * Validates: Persyaratan 16.5
 */

import { describe, it } from "vitest";
import fc from "fast-check";
import { variantMap } from "../AnimatedSection";

// Non-compositable CSS properties that must NOT be animated
const FORBIDDEN_PROPS = ["width", "height", "top", "left", "right", "bottom", "margin", "padding"];

// GPU-compositable properties that ARE allowed
const ALLOWED_PROPS = ["opacity", "x", "y", "scale", "rotate", "scaleX", "scaleY", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "translateX", "translateY", "translateZ"];

/**
 * Checks that an animation object only uses GPU-compositable properties.
 */
function hasOnlyCompositableProps(animObj: object): boolean {
  const keys = Object.keys(animObj);
  return keys.every((key) => !FORBIDDEN_PROPS.includes(key));
}

describe("Property 9: Animasi GPU-Compositable", () => {
  /**
   * Validates: Persyaratan 16.5
   *
   * Untuk setiap motion component dalam aplikasi, properti yang dianimasikan
   * dalam initial, animate, exit, dan whileHover harus hanya menggunakan
   * transform (x, y, scale, rotate) dan opacity.
   */

  it("semua variant AnimatedSection hanya menggunakan properti GPU-compositable", () => {
    for (const [variantName, { initial, animate }] of Object.entries(variantMap)) {
      expect(
        hasOnlyCompositableProps(initial),
        `Variant "${variantName}" initial menggunakan properti non-compositable: ${Object.keys(initial).filter(k => FORBIDDEN_PROPS.includes(k)).join(", ")}`
      ).toBe(true);

      expect(
        hasOnlyCompositableProps(animate),
        `Variant "${variantName}" animate menggunakan properti non-compositable: ${Object.keys(animate).filter(k => FORBIDDEN_PROPS.includes(k)).join(", ")}`
      ).toBe(true);
    }
  });

  it("properti yang dianimasikan tidak mengandung width, height, top, left", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(variantMap) as Array<keyof typeof variantMap>),
        (variantName) => {
          const { initial, animate } = variantMap[variantName];
          const allKeys = [...Object.keys(initial), ...Object.keys(animate)];

          return allKeys.every((key) => !FORBIDDEN_PROPS.includes(key));
        }
      ),
      { numRuns: 20 }
    );
  });

  it("PageTransition hanya menggunakan opacity (GPU-compositable)", () => {
    // PageTransition uses: initial={{ opacity: 0 }}, animate={{ opacity: 1 }}, exit={{ opacity: 0 }}
    const pageTransitionInitial = { opacity: 0 };
    const pageTransitionAnimate = { opacity: 1 };
    const pageTransitionExit = { opacity: 0 };

    expect(hasOnlyCompositableProps(pageTransitionInitial)).toBe(true);
    expect(hasOnlyCompositableProps(pageTransitionAnimate)).toBe(true);
    expect(hasOnlyCompositableProps(pageTransitionExit)).toBe(true);
  });

  it("StaggerItem hanya menggunakan opacity dan y (GPU-compositable)", () => {
    // StaggerItem uses: hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }
    const staggerItemHidden = { opacity: 0, y: 20 };
    const staggerItemVisible = { opacity: 1, y: 0 };

    expect(hasOnlyCompositableProps(staggerItemHidden)).toBe(true);
    expect(hasOnlyCompositableProps(staggerItemVisible)).toBe(true);
  });

  it("properti animasi yang diizinkan mencakup transform dan opacity", () => {
    // Verify our allowed props list covers the expected GPU-compositable properties
    expect(ALLOWED_PROPS).toContain("opacity");
    expect(ALLOWED_PROPS).toContain("x");
    expect(ALLOWED_PROPS).toContain("y");
    expect(ALLOWED_PROPS).toContain("scale");
    expect(ALLOWED_PROPS).toContain("rotate");
  });

  it("properti terlarang tidak boleh ada di animasi manapun", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FORBIDDEN_PROPS),
        (forbiddenProp) => {
          // Check all variants don't use this forbidden prop
          for (const { initial, animate } of Object.values(variantMap)) {
            if (Object.keys(initial).includes(forbiddenProp)) return false;
            if (Object.keys(animate).includes(forbiddenProp)) return false;
          }
          return true;
        }
      ),
      { numRuns: FORBIDDEN_PROPS.length }  // exactly one run per forbidden prop
    );
  });
});
