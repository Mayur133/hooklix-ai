import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Youtube, Video, Instagram, Crown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComingSoonModal } from "@/components/ComingSoonModal";

interface AnalysisOption {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  route: string;
  isPremium?: boolean;
  gradient: string;
}

const analysisOptions: AnalysisOption[] = [
  {
    id: "channel",
    icon: Youtube,
    title: "Full Channel Analysis",
    description: "Analyze overall channel performance, consistency, content direction, and growth patterns.",
    route: "/dashboard",
    gradient: "from-red-500/10 to-red-600/5",
  },
  {
    id: "video",
    icon: Video,
    title: "Single Video Analysis",
    description: "Analyze one specific video to understand performance, retention signals, and improvement scope.",
    route: "/video-analysis",
    gradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    id: "instagram",
    icon: Instagram,
    title: "Instagram Growth Analysis",
    description: "Practical Instagram growth guidance based on real content examples and algorithm behavior.",
    route: "/instagram-analysis",
    gradient: "from-pink-500/10 to-purple-600/5",
  },
  {
    id: "comparison",
    icon: Crown,
    title: "Channel Comparison",
    description: "Compare two channels side-by-side to identify competitive advantages and gaps.",
    route: "/channel-comparison",
    isPremium: true,
    gradient: "from-amber-500/10 to-yellow-600/5",
  },
];

const AnalysisSelector = () => {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Check premium status
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
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const handleOptionClick = (option: AnalysisOption) => {
    if (option.isPremium && !isPremium) {
      // Show loading state for 2 seconds, then show modal
      setPendingNavigation(option.route);
      setTimeout(() => {
        setPendingNavigation(null);
        setShowComingSoon(true);
      }, 2000);
      return;
    }
    navigate(option.route);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showUserMenu onSignOut={handleSignOut} userEmail={user?.email} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Choose what you want to analyze
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select an analysis type to get AI-powered insights for your content
            </p>
          </header>

          {/* Options Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Analysis options">
            {analysisOptions.map((option, index) => {
              const Icon = option.icon;
              const isLocked = option.isPremium && !isPremium;
              const isLoading = pendingNavigation === option.route;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  disabled={isLoading}
                  className={cn(
                    "relative group text-left p-6 rounded-2xl border border-border transition-all duration-300",
                    "hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
                    `bg-gradient-to-br ${option.gradient}`,
                    isLocked && "opacity-80",
                    isLoading && "cursor-wait"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  aria-label={option.title}
                >
                  {/* Premium Badge */}
                  {option.isPremium && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-medium">
                      <Crown className="w-3 h-3" />
                      COMING SOON
                    </div>
                  )}

                  {/* Lock/Loading Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl backdrop-blur-[1px]">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="font-medium">Loading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Lock className="w-5 h-5" />
                          <span className="font-medium">Coming Soon</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn("flex flex-col gap-4", isLocked && "opacity-50")}>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-background/80 border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Trust Indicators */}
          <section className="mt-12 grid grid-cols-3 gap-6 text-center" aria-label="Statistics">
            <div className="card-soft p-4">
              <div className="text-2xl font-semibold text-foreground mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Channels Analyzed</div>
            </div>
            <div className="card-soft p-4">
              <div className="text-2xl font-semibold text-foreground mb-1">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Smart Analysis</div>
            </div>
            <div className="card-soft p-4">
              <div className="text-2xl font-semibold text-foreground mb-1">Free</div>
              <div className="text-sm text-muted-foreground">Basic Insights</div>
            </div>
          </section>
        </div>
      </main>

      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
};

export default AnalysisSelector;