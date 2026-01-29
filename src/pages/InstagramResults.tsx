import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ResultCard } from "@/components/ResultCard";
import { PremiumFeaturesSection } from "@/components/PremiumFeaturesSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft,
  Instagram,
  Zap,
  Clock,
  MessageSquare,
  Target,
  TrendingUp,
  Layout,
  Sparkles,
} from "lucide-react";

const InstagramResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [postUrl, setPostUrl] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { postUrl?: string } | null;
    if (state?.postUrl) {
      setPostUrl(state.postUrl);
    } else {
      navigate("/instagram-analysis");
    }
  }, [location.state, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  if (!postUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showUserMenu onSignOut={handleSignOut} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button 
            onClick={() => navigate("/instagram-analysis")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Instagram Analysis
          </button>
          
          {/* Post Preview Card */}
          <div className="card-elevated p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Instagram className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                  Instagram Content Analysis
                </h1>
                <a 
                  href={postUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-pink-500 transition-colors truncate block"
                >
                  View Original Post →
                </a>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="card-soft p-4 mb-6 border-l-4 border-pink-500">
            <p className="text-sm text-muted-foreground">
              We do not access private Instagram data. Analysis is based on public content examples and platform behavior patterns.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-2">
            Instagram Growth Analysis
          </h2>
          <p className="text-muted-foreground">
            Algorithm-based guidance for better reach and engagement
          </p>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          {/* Hook Effectiveness */}
          <ResultCard
            icon={Zap}
            title="Hook Effectiveness (First 3 Seconds)"
            status="info"
            statusText="Critical Factor"
            delay={100}
          >
            <p className="mb-3">
              The first 3 seconds determine whether viewers stay or scroll. Instagram's algorithm heavily weights this initial engagement.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-pink-500">
              <p className="font-medium text-foreground">Best Practices</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Start with motion or a visual surprise</li>
                <li>• Use text hooks that create curiosity</li>
                <li>• Avoid slow intros or logo animations</li>
                <li>• Match the hook to your thumbnail/cover</li>
              </ul>
            </div>
          </ResultCard>

          {/* Visual Pacing */}
          <ResultCard
            icon={Clock}
            title="Visual Pacing Analysis"
            status="success"
            statusText="Key Insight"
            delay={200}
          >
            <p className="mb-3">
              Reels with dynamic pacing (cuts every 2-3 seconds) typically see 40% higher completion rates.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">Ideal Cut Rate</span>
                <p className="text-sm">Every 2-3 seconds</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">Optimal Length</span>
                <p className="text-sm">15-30 seconds for Reels</p>
              </div>
            </div>
          </ResultCard>

          {/* Caption Structure */}
          <ResultCard
            icon={MessageSquare}
            title="Caption Opening Structure"
            delay={300}
          >
            <p className="mb-3">
              Your caption's first line appears before "...more" — make it count.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-pink-500">
              <p className="font-medium text-foreground">Effective Caption Formula</p>
              <ol className="mt-2 space-y-2 text-sm">
                <li><strong>Line 1:</strong> Hook or bold statement</li>
                <li><strong>Line 2-3:</strong> Value or context</li>
                <li><strong>Middle:</strong> Story or tips (use line breaks)</li>
                <li><strong>End:</strong> Clear CTA + relevant hashtags</li>
              </ol>
            </div>
          </ResultCard>

          {/* CTA Placement */}
          <ResultCard
            icon={Target}
            title="CTA Placement Guidance"
            status="warning"
            statusText="Often Missed"
            delay={400}
          >
            <p className="mb-3">
              Most creators bury their CTA. Strategic placement can increase saves and shares by 50%.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>In-Video CTA</span>
                <span className="status-badge status-success">Use at 70% mark</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>Caption CTA</span>
                <span className="status-badge status-success">End of caption</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Story CTA</span>
                <span className="status-badge status-info">Use stickers</span>
              </div>
            </div>
          </ResultCard>

          {/* Algorithm Insights */}
          <ResultCard
            icon={TrendingUp}
            title="Instagram Algorithm Guidance"
            delay={500}
          >
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="font-medium text-foreground mb-2">Why Hooks Matter</p>
                <p className="text-sm">Instagram tracks "initial play time" — if viewers drop in 1-2 seconds, your content won't be shown to more people.</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="font-medium text-foreground mb-2">Why Saves & Shares Matter</p>
                <p className="text-sm">Saves and shares are weighted 3-5x more than likes. Create content people want to reference or send to friends.</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="font-medium text-foreground mb-2">Why Consistency Matters</p>
                <p className="text-sm">Posting 4-7 Reels/week signals to the algorithm that you're an active creator worth promoting.</p>
              </div>
            </div>
          </ResultCard>

          {/* What To Improve */}
          <ResultCard
            icon={Layout}
            title="What To Improve (Next Reel)"
            delay={600}
          >
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-pink-600">1</span>
                </div>
                <span>Add a text hook in the first frame that creates curiosity</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-pink-600">2</span>
                </div>
                <span>Increase your cut rate — aim for scene changes every 2-3 seconds</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-pink-600">3</span>
                </div>
                <span>End with a clear, specific CTA (not just "follow for more")</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-pink-600">4</span>
                </div>
                <span>Use 3-5 relevant hashtags, not 30 irrelevant ones</span>
              </li>
            </ul>
          </ResultCard>

          {/* Content Direction */}
          <ResultCard
            icon={Sparkles}
            title="Content Direction"
            status="success"
            statusText="Recommendation"
            delay={700}
          >
            <p className="mb-3">
              Based on current Instagram trends, here are formats that perform well:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">Tutorial Reels</span>
                <p className="text-sm text-muted-foreground">Step-by-step how-tos get saved</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">Before/After</span>
                <p className="text-sm text-muted-foreground">Transformations drive shares</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">POV Content</span>
                <p className="text-sm text-muted-foreground">Relatable scenarios boost comments</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">List Content</span>
                <p className="text-sm text-muted-foreground">"3 things..." format performs well</p>
              </div>
            </div>
          </ResultCard>
        </div>

        {/* Premium Features Section */}
        <PremiumFeaturesSection />

        {/* Upgrade CTA */}
        <div className="mt-12 card-elevated p-8 text-center animate-slide-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Want deeper Instagram analysis?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upgrade to get hashtag optimization, competitor analysis, and daily content ideas.
          </p>
          <Button variant="trust" size="lg">
            Upgrade Plan
          </Button>
        </div>
      </main>
    </div>
  );
};

export default InstagramResults;
