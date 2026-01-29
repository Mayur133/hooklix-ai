import { Info } from "lucide-react";

interface TrustDisclaimerProps {
  variant?: "default" | "instagram";
}

export const TrustDisclaimer = ({ variant = "default" }: TrustDisclaimerProps) => {
  const message = variant === "instagram"
    ? "We do not access private Instagram data. Analysis is based on public content examples and platform behavior patterns."
    : "This tool provides AI-based guidance using public data and patterns. Growth depends on multiple factors.";

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50 text-sm text-muted-foreground">
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
      <p>{message}</p>
    </div>
  );
};
