import { Sparkles } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="font-semibold text-lg text-foreground">Creator Analysis AI</span>
    </div>
  );
};
