import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisStep } from "@/components/AnalysisStep";
import { useToast } from "@/hooks/use-toast";
import { Search, ArrowRight } from "lucide-react";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!channelUrl.trim()) {
      toast({
        title: "Please enter a channel URL",
        description: "Paste your YouTube or Instagram channel link to begin analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    // Simulate AI analysis with progressive steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }

    // Short delay before navigating
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate("/results");
  };

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
                Paste your YouTube or Instagram channel link
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
                This usually takes about 30 seconds
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
