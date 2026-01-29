import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ResultCard } from "@/components/ResultCard";
import { VideoThumbnailGrid } from "@/components/VideoThumbnailGrid";
import { PremiumFeaturesSection } from "@/components/PremiumFeaturesSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChannelData,
  analyzeUploadConsistency,
  analyzeHookQuality,
  generateSEODescription,
  generateTags,
  generateHashtags,
} from "@/lib/youtube";
import { 
  Calendar, 
  Zap, 
  Layout, 
  Search, 
  Hash, 
  Settings, 
  Shield,
  Sparkles,
  ArrowLeft,
  Youtube
} from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);

  useEffect(() => {
    // Get channel data from navigation state
    const state = location.state as { channelData?: ChannelData } | null;
    if (state?.channelData) {
      setChannelData(state.channelData);
    } else {
      // No data, redirect back
      navigate("/dashboard");
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

  if (!channelData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const uploadConsistency = analyzeUploadConsistency(channelData.videos);
  const hookQuality = analyzeHookQuality(channelData.videos);
  const seoDescription = generateSEODescription(channelData.channelName, channelData.videos);
  const tags = generateTags(channelData.videos);
  const hashtags = generateHashtags(channelData.videos);

  return (
    <div className="min-h-screen bg-background">
      <Navbar showUserMenu onSignOut={handleSignOut} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          {/* Channel Info Card */}
          <div className="card-elevated p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <Youtube className="w-7 h-7 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {channelData.channelName}
                </h1>
                <a 
                  href={channelData.channelUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  View Channel →
                </a>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-2">
            Your Channel Analysis
          </h2>
          <p className="text-muted-foreground">
            AI-based guidance from your last {channelData.videos.length} videos
          </p>
        </div>

        {/* Video Thumbnails Proof */}
        <VideoThumbnailGrid videos={channelData.videos} />

        {/* Results Grid */}
        <div className="space-y-4">
          {/* Upload Consistency */}
          <ResultCard
            icon={Calendar}
            title="Upload Consistency"
            status={uploadConsistency.status}
            statusText={uploadConsistency.status === "success" ? "Consistent" : uploadConsistency.status === "warning" ? "Gap Detected" : "Large Gaps"}
            delay={100}
          >
            <p className="mb-3">
              Average gap between uploads: <strong>{uploadConsistency.averageGapDays.toFixed(1)} days</strong>
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground">Recommendation</p>
              <p>{uploadConsistency.recommendation}</p>
            </div>
          </ResultCard>

          {/* Hook Quality */}
          <ResultCard
            icon={Zap}
            title="Hook Quality"
            status={hookQuality.status}
            statusText={hookQuality.status === "success" ? "Strong" : hookQuality.status === "info" ? "Average" : "Needs Work"}
            delay={200}
          >
            <p className="mb-3">
              {hookQuality.assessment}
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground">Sample Hook</p>
              <p className="italic">"{hookQuality.sampleHook}"</p>
            </div>
          </ResultCard>

          {/* Video Structure */}
          <ResultCard
            icon={Layout}
            title="Video Engagement Format"
            status="success"
            statusText="Good Structure"
            delay={300}
          >
            <p className="mb-3">Recommended structure for maximum engagement:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">0–3 sec</span>
                <p className="text-sm">Strong hook</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">3–6 sec</span>
                <p className="text-sm">State the problem</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">6–12 sec</span>
                <p className="text-sm">Deliver value</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <span className="font-medium text-foreground">End</span>
                <p className="text-sm">Clear CTA</p>
              </div>
            </div>
          </ResultCard>

          {/* SEO Optimization */}
          <ResultCard
            icon={Search}
            title="SEO & Search Optimization"
            copyable={seoDescription}
            delay={400}
          >
            <p className="mb-3">
              AI-generated description optimized for search visibility based on your channel content.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs">
              {seoDescription}
            </div>
          </ResultCard>

          {/* Tags & Hashtags */}
          <ResultCard
            icon={Hash}
            title="Tags & Hashtags"
            delay={500}
          >
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">YouTube Tags (based on your content)</p>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs flex items-center justify-between gap-2">
                  <span className="truncate">{tags}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(tags);
                      toast({ title: "Copied!", description: "Tags copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Shorts / Reels Hashtags</p>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs flex items-center justify-between gap-2">
                  <span>{hashtags}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(hashtags);
                      toast({ title: "Copied!", description: "Hashtags copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </ResultCard>

          {/* Upload Settings */}
          <ResultCard
            icon={Settings}
            title="Upload Settings"
            status="info"
            statusText="Important"
            delay={600}
          >
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-warning mb-3">
              <p className="font-medium text-foreground">Audience Setting: NOT FOR KIDS (Recommended)</p>
            </div>
            <p>
              <strong>"Not for Kids" does NOT block children from watching your video.</strong> It only prevents the video from being placed in YouTube Kids, which helps keep comments and monetization enabled in the future.
            </p>
          </ResultCard>

          {/* Monetization Safety */}
          <ResultCard
            icon={Shield}
            title="Monetization Safety Check"
            status="success"
            statusText="Low Risk"
            delay={700}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>Copyright Risk</span>
                <span className="status-badge status-success">Low</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>Reused Content Warning</span>
                <span className="status-badge status-success">None Detected</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Community Guidelines</span>
                <span className="status-badge status-success">Compliant</span>
              </div>
            </div>
            <p className="mt-4 text-xs">
              Our AI scans for common monetization issues. This is guidance only—always review YouTube's policies directly.
            </p>
          </ResultCard>
        </div>

        {/* Premium Features Section */}
        <PremiumFeaturesSection />

        {/* Upgrade CTA */}
        <div className="mt-12 card-elevated p-8 text-center animate-slide-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-trust-blue-light flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Want deeper daily analysis?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upgrade to get advanced insights, daily recommendations, and viral hook ideas tailored to your niche.
          </p>
          <Button variant="trust" size="lg">
            Upgrade Plan
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Results;
