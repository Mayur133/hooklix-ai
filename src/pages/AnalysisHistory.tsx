import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Clock, 
  Youtube, 
  Instagram, 
  Video,
  ArrowLeftRight,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AnalysisHistoryItem {
  id: string;
  platform: string;
  analysis_type: string;
  channel_name: string | null;
  channel_url: string | null;
  video_count: number | null;
  created_at: string;
  analysis_data: any;
}

const AnalysisHistory = () => {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      fetchHistory(session.user.id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchHistory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchHistory = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("analysis_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setHistory(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("analysis_history")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not delete analysis. Please try again.",
        variant: "destructive",
      });
    } else {
      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis removed from history.",
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

  const getIcon = (platform: string, type: string) => {
    if (type === "comparison") return ArrowLeftRight;
    if (platform === "instagram") return Instagram;
    if (type === "video") return Video;
    return Youtube;
  };

  const getGradient = (platform: string, type: string) => {
    if (type === "comparison") return "from-amber-500/10 to-yellow-500/10";
    if (platform === "instagram") return "from-pink-500/10 to-purple-500/10";
    if (type === "video") return "from-blue-500/10 to-blue-600/10";
    return "from-red-500/10 to-red-600/10";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "channel": return "Channel Analysis";
      case "video": return "Video Analysis";
      case "comparison": return "Channel Comparison";
      default: return "Analysis";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showUserMenu onSignOut={handleSignOut} userEmail={user?.email} />

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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Analysis History
            </h1>
            <p className="text-muted-foreground">
              View your past analyses and track your progress
            </p>
          </div>

          {/* History List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Start analyzing channels to build your history
              </p>
              <Button variant="trust" onClick={() => navigate("/select")}>
                Start Analyzing
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => {
                const Icon = getIcon(item.platform, item.analysis_type);
                const gradient = getGradient(item.platform, item.analysis_type);

                return (
                  <div 
                    key={item.id}
                    className={`group card-elevated p-4 hover:border-primary/30 transition-all bg-gradient-to-br ${gradient}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-background/80 border border-border flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                            {getTypeLabel(item.analysis_type)}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {item.platform}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground truncate">
                          {item.channel_name || "Unknown Channel"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          {item.video_count && ` • ${item.video_count} videos analyzed`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.channel_url && (
                          <a
                            href={item.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalysisHistory;
