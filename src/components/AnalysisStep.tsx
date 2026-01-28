import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisStepProps {
  text: string;
  isComplete: boolean;
  isActive: boolean;
  delay?: number;
}

export const AnalysisStep = ({ text, isComplete, isActive, delay = 0 }: AnalysisStepProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300",
        isComplete ? "bg-secondary/50" : isActive ? "bg-trust-blue-light" : "opacity-40"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
        isComplete ? "bg-primary" : isActive ? "bg-primary/20" : "bg-muted"
      )}>
        {isComplete ? (
          <Check className="w-4 h-4 text-primary-foreground" />
        ) : isActive ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        )}
      </div>
      <span className={cn(
        "text-sm font-medium transition-colors duration-300",
        isComplete ? "text-foreground" : isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {text}
      </span>
    </div>
  );
};
