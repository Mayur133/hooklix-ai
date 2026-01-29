import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  History, 
  Crown, 
  Bell, 
  Settings, 
  HelpCircle,
  Youtube,
  Video,
  Instagram,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
}

export const MobileMenu = ({ isOpen, onClose, isPremium = false }: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
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
        { icon: Bell, label: "Email Notifications", path: "/settings" },
        { icon: Crown, label: "Upgrade to Premium", path: "/upgrade", highlight: true },
      ],
    },
    {
      label: "Support",
      items: [
        { icon: HelpCircle, label: "Help & FAQ", path: "/help" },
        { icon: Settings, label: "Settings", path: "/settings" },
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
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isLocked = item.premium && !isPremium;

                  return (
                    <button
                      key={itemIndex}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                        item.highlight 
                          ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-600" 
                          : "hover:bg-secondary",
                        isLocked && "opacity-60"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5",
                        item.highlight ? "text-amber-500" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "flex-1 text-left font-medium",
                        item.highlight ? "text-amber-600" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.premium && (
                        <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          PRO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
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
