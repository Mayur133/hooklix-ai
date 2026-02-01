import { useState } from "react";
import { Star } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { MobileMenu, MenuButton } from "./MobileMenu";
import { RatingModal } from "./RatingModal";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
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
              <MenuButton onClick={() => setIsMenuOpen(true)} />
            </div>
          </div>
        </div>
      </nav>
      
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
      />

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        pageName={location.pathname}
      />
    </>
  );
};
