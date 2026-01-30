import logoImage from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={logoImage} 
        alt="Creators Analytics AI" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
            HOOKLIX
          </span>
          <span className="text-xs font-medium text-red-500 tracking-wider">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
