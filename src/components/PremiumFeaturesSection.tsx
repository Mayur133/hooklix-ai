import { useState } from "react";
import { Crown, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumFeature {
  title: string;
  description: string;
}

const topPremiumFeatures: PremiumFeature[] = [
  {
    title: "Intro Weakness Detector",
    description: "Detects first-10-second hook problems and suggests stronger opening structures.",
  },
  {
    title: "Title Tone Advisor",
    description: "Analyzes emotional vs informational balance and suggests better title intent.",
  },
  {
    title: "Thumbnail–Title Sync Warning",
    description: "Identifies mismatch between thumbnail promise and title wording.",
  },
  {
    title: "SEO Optimization Assistant",
    description: "SEO-friendly title structure, search-intent based description framework, keyword placement guidance, and tag strategy.",
  },
  {
    title: "Audience Insight Interpreter",
    description: "Explains how to read age groups, geography, watch time trends from YT Studio and tells what content to make for that audience.",
  },
];

const additionalPremiumFeatures: PremiumFeature[] = [
  {
    title: "Consistency Gap Alert",
    description: "Alerts you when your upload schedule breaks pattern and suggests recovery strategies.",
  },
  {
    title: "Audience Interest Mapper",
    description: "Maps your audience's related interests to help you create cross-content opportunities.",
  },
  {
    title: "Next Video Direction",
    description: "AI-powered suggestions for your next video topic based on performance patterns.",
  },
  {
    title: "Re-analyze Reminder (7 days)",
    description: "Automatic email reminder to re-analyze your channel weekly for tracking progress.",
  },
  {
    title: "Growth Mistake Alerts",
    description: "Real-time alerts when your channel shows signs of common growth mistakes.",
  },
  {
    title: "Progress Comparison",
    description: "Compare your metrics over time to see growth trends and identify what's working.",
  },
  {
    title: "Focus Recommendations",
    description: "Prioritized action items based on your specific channel's biggest opportunities.",
  },
];

export const PremiumFeaturesSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
      {/* Premium Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-600">Premium Features</span>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Premium Features Grid */}
      <div className="card-elevated p-6">
        <div className="space-y-4">
          {/* Top 5 Features - Always Visible */}
          {topPremiumFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-4 rounded-xl border border-border bg-gradient-to-br from-amber-500/5 to-yellow-500/5 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                  PRO
                </span>
              </div>
            </div>
          ))}

          {/* Expandable Section */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
              {additionalPremiumFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative p-4 rounded-xl border border-border bg-gradient-to-br from-amber-500/5 to-yellow-500/5 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                      PRO
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Read More Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-amber-500/30",
              "text-sm font-medium text-amber-600 hover:bg-amber-500/5 transition-all"
            )}
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read More — Unlock All {additionalPremiumFeatures.length + topPremiumFeatures.length} Premium Features
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
