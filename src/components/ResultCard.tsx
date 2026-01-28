import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  status?: "success" | "warning" | "error" | "info";
  statusText?: string;
  children: ReactNode;
  copyable?: string;
  delay?: number;
}

export const ResultCard = ({ 
  icon: Icon, 
  title, 
  status, 
  statusText, 
  children, 
  copyable,
  delay = 0 
}: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyable) {
      navigator.clipboard.writeText(copyable);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusStyles = {
    success: "status-success",
    warning: "status-warning",
    error: "status-error",
    info: "status-info",
  };

  return (
    <div 
      className="card-elevated p-6 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-trust-blue-light flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {status && statusText && (
              <span className={cn("status-badge mt-1", statusStyles[status])}>
                {statusText}
              </span>
            )}
          </div>
        </div>
        {copyable && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>
      <div className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};
