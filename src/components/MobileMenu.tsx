import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  History, 
  Crown, 
  Settings, 
  Youtube,
  Video,
  Instagram,
  ArrowLeftRight,
  Info,
  FileText,
  Shield,
  Mail,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ComingSoonModal } from "./ComingSoonModal";
import { RatingModal } from "./RatingModal";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
}

export const MobileMenu = ({ isOpen, onClose, isPremium = false }: MobileMenuProps) => {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleNavigate = (path: string, isPremiumFeature?: boolean) => {
    if (isPremiumFeature && !isPremium) {
      // Show loading state for 2 seconds, then show modal
      setPendingPath(path);
      setTimeout(() => {
        setPendingPath(null);
        setShowComingSoon(true);
      }, 2000);
      return;
    }
    navigate(path);
    onClose();
  };

  const menuItems = [
    {
      label: "Analysis Options",
      items: [
        { icon: Youtube, label: "Full Channel Analysis", path: "/dashboard" },
        { icon: Video, label: "Single Video Analysis", path: "/video-analysis" },
        { icon: Instagram, label: "Instagram Analysis", path: "/instagram-analysis" },
        { icon: ArrowLeftRight, label: "Channel Comparison", path: "/channel-comparison", premium: true },
      ],
    },
    {
      label: "Your Account",
      items: [
        { icon: History, label: "Analysis History", path: "/history", premium: true },
        { icon: Settings, label: "Settings", path: "/settings" },
        { icon: Crown, label: "Premium Features", path: "/upgrade", highlight: true, premium: true },
      ],
    },
    {
      label: "Support & Legal",
      items: [
        { icon: Info, label: "About", path: "/about" },
        { icon: Shield, label: "Privacy Policy", path: "/privacy" },
        { icon: FileText, label: "Terms of Service", path: "/terms" },
        { icon: Mail, label: "Contact", path: "/contact" },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-foreground">Menu</span>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-65px)]">
          {/* Rate Us Button (Mobile) */}
          <button
            onClick={() => {
              setShowRatingModal(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 hover:from-amber-500/20 hover:to-yellow-500/20 transition-all"
          >
            <Star className="w-5 h-5 text-amber-500" />
            <span className="flex-1 text-left font-medium text-amber-600">Rate Hooklix AI</span>
          </button>

          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isLocked = item.premium && !isPremium;
                  const isLoading = pendingPath === item.path;

                  return (
                    <button
                      key={itemIndex}
                      onClick={() => handleNavigate(item.path, item.premium)}
                      disabled={isLoading}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                        item.highlight 
                          ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-600" 
                          : "hover:bg-secondary",
                        isLocked && "opacity-60",
                        isLoading && "cursor-wait"
                      )}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon className={cn(
                          "w-5 h-5",
                          item.highlight ? "text-amber-500" : "text-muted-foreground"
                        )} />
                      )}
                      <span className={cn(
                        "flex-1 text-left font-medium",
                        item.highlight ? "text-amber-600" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.premium && (
                        <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          SOON
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Support Email */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Support: <a href="mailto:hooklixai@gmail.com" className="text-primary hover:underline">hooklixai@gmail.com</a>
            </p>
          </div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        pageName="/mobile-menu"
      />
    </>
  );
};

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-secondary transition-colors"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5 text-foreground" />
    </button>
  );
};
