import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisStep } from "@/components/AnalysisStep";
import { useToast } from "@/hooks/use-toast";
import { Video, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ANALYSIS_STEPS = [
  "AI Team is analyzing your video…",
  "Checking video metadata…",
  "Analyzing title and thumbnail sync…",
  "Evaluating hook strength…",
  "Reviewing engagement signals…",
  "Generating improvement suggestions…",
];

const VideoAnalysis = () => {
  const [videoUrl, setVideoUrl] = useState("");
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

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Please enter a video URL",
        description: "Paste your YouTube video link to begin analysis.",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      // Fetch video info via oEmbed
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oEmbedUrl);
      
      if (!response.ok) {
        throw new Error("Could not fetch video information");
      }

      const videoData = await response.json();

      // Animate through steps
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(i + 1);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to history
      if (user) {
        await supabase.from("analysis_history").insert([{
          user_id: user.id,
          platform: "youtube" as const,
          analysis_type: "video" as const,
          channel_name: videoData.author_name,
          channel_url: videoData.author_url,
          video_count: 1,
          analysis_data: JSON.parse(JSON.stringify({
            video_id: videoId,
            title: videoData.title,
            thumbnail: videoData.thumbnail_url,
            author: videoData.author_name,
          })),
        }]);
      }

      navigate("/video-results", { 
        state: { 
          videoData: {
            videoId,
            title: videoData.title,
            thumbnail: videoData.thumbnail_url,
            author: videoData.author_name,
            authorUrl: videoData.author_url,
          }
        } 
      });
    } catch (error: any) {
      setIsAnalyzing(false);
      setCurrentStep(-1);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze the video. Please check the URL and try again.",
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
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Single Video Analysis
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Get detailed insights on one specific video's performance, retention signals, and improvement opportunities.
              </p>
            </div>

            {/* Input Card */}
            <div className="card-elevated p-8 mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                Paste your YouTube video URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
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
                  Analyze Video
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Supports: youtube.com/watch, youtu.be, and youtube.com/shorts links
              </p>
            </div>

            {/* What You'll Get */}
            <div className="card-soft p-6">
              <h3 className="font-semibold text-foreground mb-4">Video Performance Analyzer™ — FREE</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  View Velocity Check
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Engagement Health
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Retention Signals (Estimated)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  What To Change (Next Upload)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Re-upload or Move On Suggestion
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Analysis Progress */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Analyzing your video...
              </h2>
              <p className="text-muted-foreground">
                Fetching video data and generating insights
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

export default VideoAnalysis;
