import { motion, type Variants } from "framer-motion";

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
    },
  },
};

/**
 * StaggerItem — item used inside StaggerContainer.
 *
 * Inherits timing from the parent StaggerContainer via Framer Motion's
 * variant propagation. Only uses GPU-compositable properties: opacity and y (transform).
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
