import { useState, useEffect } from "react";
import { Rocket, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={cn(
          "relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-4">
            🚀 This feature is coming soon.
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mb-2">
            Until then, scale your channel using our{" "}
            <span className="font-semibold text-foreground">FREE AI tools</span>.
          </p>
          <p className="text-muted-foreground mb-8">
            Top creators grow with{" "}
            <span className="font-semibold bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
              Hooklix AI
            </span>.
          </p>

          {/* CTA Button */}
          <Button
            variant="trust"
            size="lg"
            onClick={handleClose}
            className="w-full"
          >
            Continue with Free
          </Button>
        </div>
      </div>
    </div>
  );
};
