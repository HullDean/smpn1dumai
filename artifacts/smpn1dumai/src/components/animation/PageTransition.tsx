import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  locationKey: string;
}

/**
 * PageTransition — wrapper for page transition animations using AnimatePresence.
 *
 * Animates opacity: 0 → 1 with duration 300ms, easeOut.
 * Accepts locationKey as a unique key per page (from useLocation).
 * Only uses GPU-compositable properties: opacity.
 */
export function PageTransition({ children, locationKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
