import { Star, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

interface NavbarProps {
  showUserMenu?: boolean;
  onSignOut?: () => void;
  userEmail?: string;
}

export const Navbar = ({ showUserMenu = false, onSignOut, userEmail }: NavbarProps) => {
  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {showUserMenu && (
            <div className="flex items-center gap-3">
              <Button variant="rate" size="sm" className="gap-2">
                <Star className="w-4 h-4" />
                Rate Us
              </Button>
              <button 
                onClick={onSignOut}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                title={userEmail || "Sign out"}
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
