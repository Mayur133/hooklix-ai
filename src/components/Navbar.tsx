import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { MobileMenu, MenuButton } from "./MobileMenu";
import { RatingModal } from "./RatingModal";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface NavbarProps {
  showUserMenu?: boolean;
  onSignOut?: () => void;
  userEmail?: string;
}

export const Navbar = ({ showUserMenu = false, onSignOut, userEmail }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkPremium = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, premium_until")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (profile) {
          const isCurrentlyPremium = profile.is_premium && 
            (!profile.premium_until || new Date(profile.premium_until) > new Date());
          setIsPremium(isCurrentlyPremium);
        }
      }
    };
    
    if (showUserMenu) {
      checkPremium();
    }
  }, [showUserMenu]);

  return (
    <>
      <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            {showUserMenu && (
              <div className="flex items-center gap-3">
                <Button 
                  variant="rate" 
                  size="sm" 
                  className="gap-2 hidden sm:flex"
                  onClick={() => setIsRatingModalOpen(true)}
                >
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
                <MenuButton onClick={() => setIsMenuOpen(true)} />
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        isPremium={isPremium}
      />

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        pageName={location.pathname}
      />
    </>
  );
};
