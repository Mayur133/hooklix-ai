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
  Video,
  Zap,
  TrendingUp,
  Clock,
  RefreshCw,
  Target,
  Sparkles,
} from "lucide-react";

interface VideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  author: string;
  authorUrl: string;
}

const VideoResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  useEffect(() => {
    const state = location.state as { videoData?: VideoData } | null;
    if (state?.videoData) {
      setVideoData(state.videoData);
    } else {
      navigate("/video-analysis");
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

  if (!videoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Generate analysis based on title
  const analyzeTitle = (title: string) => {
    const hasHook = /how|why|secret|shocking|truth|must|never|always/i.test(title);
    const hasNumbers = /\d+/.test(title);
    const length = title.length;
    
    return {
      hookStrength: hasHook ? "Strong" : "Weak",
      hasNumbers,
      lengthStatus: length < 60 ? "Good" : "Too Long",
      score: (hasHook ? 40 : 10) + (hasNumbers ? 20 : 0) + (length < 60 ? 30 : 10),
    };
  };

  const titleAnalysis = analyzeTitle(videoData.title);

  return (
    <div className="min-h-screen bg-background">
      <Navbar showUserMenu onSignOut={handleSignOut} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button 
            onClick={() => navigate("/video-analysis")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Video Analysis
          </button>
          
          {/* Video Preview Card */}
          <div className="card-elevated p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <img 
                src={videoData.thumbnail} 
                alt={videoData.title}
                className="w-full sm:w-48 h-auto rounded-lg object-cover"
              />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {videoData.title}
                </h1>
                <a 
                  href={videoData.authorUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {videoData.author} →
                </a>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-2">
            Video Performance Analyzer™
          </h2>
          <p className="text-muted-foreground">
            AI-based insights for this specific video
          </p>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          {/* View Velocity Check */}
          <ResultCard
            icon={TrendingUp}
            title="View Velocity Check"
            status={titleAnalysis.score > 50 ? "success" : "warning"}
            statusText={titleAnalysis.score > 50 ? "Good Potential" : "Needs Improvement"}
            delay={100}
          >
            <p className="mb-3">
              Based on title optimization score: <strong>{titleAnalysis.score}/100</strong>
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground">What this means</p>
              <p>Videos with optimized titles typically see 2-3x better click-through rates in the first 48 hours.</p>
            </div>
          </ResultCard>

          {/* Hook Strength */}
          <ResultCard
            icon={Zap}
            title="Hook Strength Analysis"
            status={titleAnalysis.hookStrength === "Strong" ? "success" : "warning"}
            statusText={titleAnalysis.hookStrength}
            delay={200}
          >
            <p className="mb-3">
              {titleAnalysis.hookStrength === "Strong" 
                ? "Your title contains curiosity-driving words that encourage clicks."
                : "Consider adding power words like 'How', 'Why', 'Secret', or 'Truth' to boost curiosity."}
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground">First 3 Seconds Rule</p>
              <p>The title should match the hook in your video opening. Viewers decide to stay within 3 seconds.</p>
            </div>
          </ResultCard>

          {/* Retention Signals */}
          <ResultCard
            icon={Clock}
            title="Retention Signals (Estimated)"
            status="info"
            statusText="Analysis"
            delay={300}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>Title Length</span>
                <span className={`status-badge ${titleAnalysis.lengthStatus === "Good" ? "status-success" : "status-warning"}`}>
                  {titleAnalysis.lengthStatus} ({videoData.title.length} chars)
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>Number Usage</span>
                <span className={`status-badge ${titleAnalysis.hasNumbers ? "status-success" : "status-info"}`}>
                  {titleAnalysis.hasNumbers ? "Present" : "Consider Adding"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Curiosity Gap</span>
                <span className={`status-badge ${titleAnalysis.hookStrength === "Strong" ? "status-success" : "status-warning"}`}>
                  {titleAnalysis.hookStrength === "Strong" ? "Created" : "Missing"}
                </span>
              </div>
            </div>
          </ResultCard>

          {/* What To Change */}
          <ResultCard
            icon={Target}
            title="What To Change (Next Upload)"
            delay={400}
          >
            <ul className="space-y-3">
              {titleAnalysis.hookStrength !== "Strong" && (
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-warning">1</span>
                  </div>
                  <span>Add a curiosity-driving word to your title (How, Why, Secret, Truth)</span>
                </li>
              )}
              {!titleAnalysis.hasNumbers && (
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-warning">2</span>
                  </div>
                  <span>Include a specific number in your title for better CTR (e.g., "5 Ways..." or "In 30 Days")</span>
                </li>
              )}
              {titleAnalysis.lengthStatus !== "Good" && (
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-warning">3</span>
                  </div>
                  <span>Shorten your title to under 60 characters for better mobile display</span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">✓</span>
                </div>
                <span>Ensure your thumbnail clearly visualizes the promise in your title</span>
              </li>
            </ul>
          </ResultCard>

          {/* Re-upload or Move On */}
          <ResultCard
            icon={RefreshCw}
            title="Re-upload or Move On?"
            status={titleAnalysis.score > 60 ? "success" : "info"}
            statusText={titleAnalysis.score > 60 ? "Keep & Optimize" : "Consider Changes"}
            delay={500}
          >
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary mb-3">
              <p className="font-medium text-foreground">Our Recommendation</p>
              <p>
                {titleAnalysis.score > 60 
                  ? "This video has good optimization potential. Focus on promoting it and analyzing viewer retention data from YouTube Studio."
                  : "Consider updating the title and thumbnail to test improved click-through rates. Monitor for 48-72 hours before deciding."}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Re-uploading should only be considered for videos under 48 hours old with very low impressions.
            </p>
          </ResultCard>
        </div>

        {/* Premium Features Section */}
        <PremiumFeaturesSection />

        {/* Upgrade CTA */}
        <div className="mt-12 card-elevated p-8 text-center animate-slide-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-trust-blue-light flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Want deeper video analysis?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upgrade to get advanced insights, A/B title testing suggestions, and viral hook ideas.
          </p>
          <Button variant="trust" size="lg">
            Upgrade Plan
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VideoResults;
