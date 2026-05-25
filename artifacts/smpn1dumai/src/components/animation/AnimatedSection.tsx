import { motion, useReducedMotion, type Variants } from "framer-motion";

export type AnimationVariant =
  | "fadeIn"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scaleIn";

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const DURATION_MIN = 0.4;
const DURATION_MAX = 0.7;
const DEFAULT_DURATION = 0.6;

/**
 * Clamps duration to the valid range [0.4, 0.7] seconds.
 */
function clampDuration(duration: number): number {
  return Math.min(DURATION_MAX, Math.max(DURATION_MIN, duration));
}

const variantMap: Record<AnimationVariant, { initial: object; animate: object }> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
};

/**
 * AnimatedSection — wrapper scroll-triggered animation.
 *
 * Supports variants: fadeIn, slideUp, slideLeft, slideRight, scaleIn.
 * Respects prefers-reduced-motion via useReducedMotion().
 * All animations use viewport={{ once: true }}.
 * transition.duration is always clamped to [0.4, 0.7] seconds.
 */
export function AnimatedSection({
  children,
  variant = "fadeIn",
  delay = 0,
  duration = DEFAULT_DURATION,
  className,
  once = true,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const clampedDuration = clampDuration(duration);
  const { initial, animate } = variantMap[variant];

  // When prefers-reduced-motion is active, skip animation by using animate state as initial
  const resolvedInitial = shouldReduceMotion ? animate : initial;

  const variants: Variants = {
    hidden: resolvedInitial,
    visible: animate,
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={variants}
      transition={{
        duration: clampedDuration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export { clampDuration, DURATION_MIN, DURATION_MAX, DEFAULT_DURATION, variantMap };
