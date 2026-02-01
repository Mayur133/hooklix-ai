import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisStep } from "@/components/AnalysisStep";
import { TrustDisclaimer } from "@/components/TrustDisclaimer";
import { useToast } from "@/hooks/use-toast";
import { Instagram, ArrowRight, ArrowLeft } from "lucide-react";

const ANALYSIS_STEPS = [
  "AI Team is analyzing your content…",
  "Checking post/reel metadata…",
  "Analyzing hook effectiveness…",
  "Evaluating visual pacing…",
  "Reviewing caption structure…",
  "Generating algorithm insights…",
];

const InstagramAnalysis = () => {
  const [postUrl, setPostUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!postUrl.trim()) {
      toast({
        title: "Please enter a post URL",
        description: "Paste your Instagram post or reel link to begin analysis.",
        variant: "destructive",
      });
      return;
    }

    // Validate Instagram URL
    if (!postUrl.includes("instagram.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Instagram post or reel URL.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      // Animate through steps
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(i + 1);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/instagram-results", { 
        state: { 
          postUrl,
        } 
      });
    } catch (error: any) {
      setIsAnalyzing(false);
      setCurrentStep(-1);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isAnalyzing ? (
          <div className="animate-fade-in">
            {/* Back Button */}
            <button 
              onClick={() => navigate("/select")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Selection
            </button>

            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Instagram className="w-8 h-8 text-pink-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Instagram Growth Analysis
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Practical Instagram growth guidance based on real content examples and algorithm behavior.
              </p>
            </div>

            {/* Input Card */}
            <div className="card-elevated p-8 mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                Paste your Instagram post or reel URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://instagram.com/p/... or /reel/..."
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
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
                  Analyze Post
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Supports: instagram.com/p/, instagram.com/reel/, and instagram.com/tv/ links
              </p>
            </div>

            {/* Trust Disclaimer */}
            <TrustDisclaimer variant="instagram" />

            {/* What You'll Get */}
            <div className="card-soft p-6 mt-6">
              <h3 className="font-semibold text-foreground mb-4">Instagram Growth Insights</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Hook Effectiveness Analysis (First 3 Seconds)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Visual Pacing Evaluation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Caption Opening Structure Review
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  CTA Placement Guidance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Algorithm Behavior Insights
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Analysis Progress */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-3 border-pink-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Analyzing your content...
              </h2>
              <p className="text-muted-foreground">
                Generating algorithm-based insights
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

      <Footer />
    </div>
  );
};

export default InstagramAnalysis;
