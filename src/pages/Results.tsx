import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Zap, 
  Layout, 
  Search, 
  Hash, 
  Settings, 
  Shield,
  Sparkles,
  ArrowLeft
} from "lucide-react";

const SAMPLE_SEO_DESCRIPTION = `Learn how to grow your YouTube channel with proven strategies in 2024. This video covers content optimization, audience engagement, and monetization tips that actually work. Perfect for beginner creators looking to take their channel to the next level.`;

const SAMPLE_TAGS = "youtube growth, content creator tips, youtube algorithm, grow youtube channel, youtube monetization, creator economy, video marketing";

const SAMPLE_HASHTAGS = "#YouTubeGrowth #ContentCreator #YouTubeTips #CreatorEconomy #VideoMarketing";

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

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
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Your Channel Analysis
          </h1>
          <p className="text-muted-foreground">
            AI-based guidance to help improve your content performance
          </p>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          {/* Upload Consistency */}
          <ResultCard
            icon={Calendar}
            title="Upload Consistency"
            status="warning"
            statusText="Gap Detected"
            delay={100}
          >
            <p className="mb-3">
              We detected irregular upload patterns in your recent content. Consistent uploads help the algorithm recommend your content more frequently.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground">Recommendation</p>
              <p>Best growth: 1 video/day or 1 video every 2 days for optimal algorithm performance.</p>
            </div>
          </ResultCard>

          {/* Hook Quality */}
          <ResultCard
            icon={Zap}
            title="Hook Quality"
            status="info"
            statusText="Average"
            delay={200}
          >
            <p className="mb-3">
              Your first 2–3 seconds decide retention. Strong hooks can increase watch time by up to 40%.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground">Sample Hook</p>
              <p className="italic">"I discovered something that changed everything about my content strategy—and it took me 2 years to figure out..."</p>
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
            copyable={SAMPLE_SEO_DESCRIPTION}
            delay={400}
          >
            <p className="mb-3">
              AI-generated description optimized for search visibility. Uses keywords based on common Google search questions.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs">
              {SAMPLE_SEO_DESCRIPTION}
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
                <p className="font-medium text-foreground mb-2">YouTube Tags</p>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs flex items-center justify-between gap-2">
                  <span className="truncate">{SAMPLE_TAGS}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(SAMPLE_TAGS);
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Shorts / Reels Hashtags</p>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs flex items-center justify-between gap-2">
                  <span>{SAMPLE_HASHTAGS}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(SAMPLE_HASHTAGS);
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
