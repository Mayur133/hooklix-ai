import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  Youtube, 
  Instagram, 
  Video,
  ArrowLeftRight,
} from "lucide-react";

const AnalysisHistory = () => {
  const navigate = useNavigate();

  const getIcon = (platform: string, type: string) => {
    if (type === "comparison") return ArrowLeftRight;
    if (platform === "instagram") return Instagram;
    if (type === "video") return Video;
    return Youtube;
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Analysis History
            </h1>
            <p className="text-muted-foreground">
              View your past analyses and track your progress
            </p>
          </div>

          {/* Empty State */}
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
        </div>
      </main>
    </div>
  );
};

export default AnalysisHistory;
