import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  ArrowRight, 
  Crown, 
  Lock,
  Youtube,
  ArrowLeftRight,
} from "lucide-react";

const ChannelComparison = () => {
  const [channel1Url, setChannel1Url] = useState("");
  const [channel2Url, setChannel2Url] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCompare = async () => {
    toast({
      title: "Coming Soon",
      description: "Channel Comparison is a premium feature coming soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          {/* Back Button */}
          <button 
            onClick={() => navigate("/select")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </button>

          {/* Premium Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-medium">
              <Crown className="w-4 h-4" />
              COMING SOON
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <ArrowLeftRight className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Channel Comparison
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Compare two channels side-by-side to identify competitive advantages and growth opportunities.
            </p>
          </div>

          {/* Input Card */}
          <div className="card-elevated p-8 mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl backdrop-blur-sm z-10">
              <div className="text-center p-6">
                <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Channel comparison feature is under development.
                </p>
                <Button variant="trust" size="lg" onClick={() => navigate("/select")}>
                  Explore Other Features
                </Button>
              </div>
            </div>

            <div className="space-y-6 opacity-50">
              {/* Channel 1 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  First Channel
                </label>
                <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/@channel1"
                    value={channel1Url}
                    onChange={(e) => setChannel1Url(e.target.value)}
                    className="input-field pl-12 h-12"
                    disabled
                  />
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm font-medium text-muted-foreground">VS</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Channel 2 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Second Channel
                </label>
                <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/@channel2"
                    value={channel2Url}
                    onChange={(e) => setChannel2Url(e.target.value)}
                    className="input-field pl-12 h-12"
                    disabled
                  />
                </div>
              </div>

              <Button 
                variant="trust" 
                size="lg" 
                onClick={handleCompare}
                className="w-full gap-2"
                disabled
              >
                Compare Channels
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="card-soft p-6">
            <h3 className="font-semibold text-foreground mb-4">Comparison Insights (Coming Soon)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Upload frequency comparison
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Title and hook strategy differences
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Content format analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Competitive advantage identification
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Growth opportunity recommendations
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChannelComparison;
