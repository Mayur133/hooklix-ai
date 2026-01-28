import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisStep } from "@/components/AnalysisStep";
import { useToast } from "@/hooks/use-toast";
import { Search, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchChannelData, ChannelData } from "@/lib/youtube";

const ANALYSIS_STEPS = [
  "AI Team is analyzing your channel…",
  "Checking your last 10 videos…",
  "Analyzing upload consistency…",
  "Evaluating hooks and engagement…",
  "Reviewing tags, hashtags, and SEO…",
  "Checking monetization-safe settings…",
];

const Dashboard = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [user, setUser] = useState<any>(null);
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

  const handleAnalyze = async () => {
    if (!channelUrl.trim()) {
      toast({
        title: "Please enter a channel URL",
        description: "Paste your YouTube channel link, @username, or video URL to begin analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      // Start step animation while fetching
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);

      // Fetch real channel data
      const channelData = await fetchChannelData(channelUrl);
      
      clearInterval(stepInterval);
      
      // Complete remaining steps quickly
      for (let i = currentStep; i < ANALYSIS_STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setCurrentStep(i + 1);
      }

      // Short delay before navigating
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Navigate with channel data
      navigate("/results", { state: { channelData } });
    } catch (error: any) {
      setIsAnalyzing(false);
      setCurrentStep(-1);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze the channel. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showUserMenu onSignOut={handleSignOut} userEmail={user?.email} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isAnalyzing ? (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                We are analyzing your channel with AI
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Our AI system checks your recent videos, upload behavior, and content structure to identify growth opportunities.
              </p>
            </div>

            {/* Input Card */}
            <div className="card-elevated p-8 mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                Paste your YouTube channel link, @username, or video URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/@yourchannel"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    className="input-field pl-12 h-12"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                </div>
                <Button 
                  variant="trust" 
                  size="lg" 
                  onClick={handleAnalyze}
                  className="gap-2 whitespace-nowrap"
                >
                  Analyze Channel
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Examples: youtube.com/@MrBeast, youtube.com/channel/UC..., or any video URL
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 text-center">
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
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Analysis Progress */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-trust-blue-light flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Analyzing your channel...
              </h2>
              <p className="text-muted-foreground">
                Fetching real data from YouTube
              </p>
            </div>

            {/* Progress Steps */}
            <div className="card-elevated p-6 space-y-2">
              {ANALYSIS_STEPS.map((step, index) => (
                <AnalysisStep
                  key={index}
                  text={step}
                  isComplete={currentStep > index}
                  isActive={currentStep === index}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
