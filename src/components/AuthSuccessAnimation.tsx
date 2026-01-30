import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@/assets/logo.png";

interface AuthSuccessAnimationProps {
  onComplete: () => void;
}

export const AuthSuccessAnimation = ({ onComplete }: AuthSuccessAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [phase, setPhase] = useState<"rope" | "forming" | "complete">("rope");

  useEffect(() => {
    // Phase 1: Rope animation (0-800ms)
    const ropeTimer = setTimeout(() => setPhase("forming"), 800);
    
    // Phase 2: Logo forming (800-2000ms)
    const formingTimer = setTimeout(() => setPhase("complete"), 2000);
    
    // Phase 3: Complete and fade (2500ms)
    const completeTimer = setTimeout(() => {
      setShowAnimation(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => {
      clearTimeout(ropeTimer);
      clearTimeout(formingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Rope to Logo Animation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Rope Phase */}
              {phase === "rope" && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-1 h-24 bg-gradient-to-b from-purple-600 via-red-500 to-amber-500 rounded-full origin-top"
                />
              )}

              {/* Forming Phase - Rope transforms into logo shape */}
              {phase === "forming" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  {/* Animated gradient ring forming */}
                  <svg viewBox="0 0 100 100" className="w-28 h-28">
                    <defs>
                      <linearGradient id="formingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="25%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="75%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M 50 10 
                         C 80 10, 90 40, 90 50 
                         C 90 70, 70 90, 50 90 
                         C 30 90, 10 70, 10 50 
                         C 10 30, 30 10, 50 10"
                      fill="none"
                      stroke="url(#formingGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    {/* Inner play triangle */}
                    <motion.path
                      d="M 40 30 L 70 50 L 40 70 Z"
                      fill="url(#formingGradient)"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    />
                  </svg>
                </motion.div>
              )}

              {/* Complete Phase - Show actual logo */}
              {phase === "complete" && (
                <motion.div
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img 
                    src={logoImage} 
                    alt="Hooklix AI" 
                    className="w-28 h-28 object-contain"
                  />
                </motion.div>
              )}
            </div>

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase !== "rope" ? 1 : 0, y: phase !== "rope" ? 0 : 10 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold mb-1">
                <span className="bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                  HOOKLIX AI
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Preparing your dashboard...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
