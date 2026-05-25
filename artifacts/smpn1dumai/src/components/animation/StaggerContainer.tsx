import { motion, type Variants } from "framer-motion";

export const STAGGER_MIN = 0.06;
export const STAGGER_MAX = 0.1;
export const DEFAULT_STAGGER = 0.08;

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}

/**
 * Clamps staggerChildren to the valid range [0.06, 0.1] seconds.
 */
export function clampStagger(stagger: number): number {
  return Math.min(STAGGER_MAX, Math.max(STAGGER_MIN, stagger));
}

/**
 * StaggerContainer — distributes stagger delay to children.
 *
 * staggerChildren default is 0.08 (80ms), always clamped to [0.06, 0.1].
 * Children should be wrapped in StaggerItem to receive the stagger animation.
 */
export function StaggerContainer({
  children,
  staggerDelay = DEFAULT_STAGGER,
  delayChildren = 0,
  className,
}: StaggerContainerProps) {
  const clampedStagger = clampStagger(staggerDelay);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: clampedStagger,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}
