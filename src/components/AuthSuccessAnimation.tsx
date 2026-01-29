import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthSuccessAnimationProps {
  onComplete: () => void;
}

export const AuthSuccessAnimation = ({ onComplete }: AuthSuccessAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
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
            {/* Abstract Logo Mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 8, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
                className="w-24 h-24 rounded-full border-2 border-primary/20"
              />
              
              {/* Inner pulsing core */}
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 0.7, 0.5] }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <motion.div
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ 
                      duration: 3, 
                      ease: "easeInOut", 
                      repeat: Infinity 
                    }}
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      className="text-primary-foreground"
                    >
                      <path 
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Orbiting dots */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 4, 
                    ease: "linear", 
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div 
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/60"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Welcome to Creator Analysis AI
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
