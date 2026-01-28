import { supabase } from "@/integrations/supabase/client";

export interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
}

export interface ChannelData {
  channelId: string;
  channelName: string;
  channelUrl: string;
  videos: VideoData[];
}

export interface AnalysisResult {
  channelData: ChannelData;
  uploadConsistency: {
    status: "success" | "warning" | "error";
    averageGapDays: number;
    recommendation: string;
  };
  hookQuality: {
    status: "success" | "warning" | "info";
    assessment: string;
    sampleHook: string;
  };
}

export async function fetchChannelData(channelUrl: string): Promise<ChannelData> {
  const { data, error } = await supabase.functions.invoke('youtube-rss', {
    body: { channelUrl },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch channel data');
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch channel data');
  }

  return data.data;
}

export function analyzeUploadConsistency(videos: VideoData[]): AnalysisResult["uploadConsistency"] {
  if (videos.length < 2) {
    return {
      status: "warning",
      averageGapDays: 0,
      recommendation: "Not enough videos to analyze upload consistency. Upload more videos for better insights.",
    };
  }

  // Calculate gaps between uploads
  const gaps: number[] = [];
  for (let i = 0; i < videos.length - 1; i++) {
    const date1 = new Date(videos[i].publishedAt);
    const date2 = new Date(videos[i + 1].publishedAt);
    const diffDays = Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
    gaps.push(diffDays);
  }

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

  if (avgGap <= 2) {
    return {
      status: "success",
      averageGapDays: avgGap,
      recommendation: "Excellent! You're uploading very consistently. This helps the algorithm recommend your content.",
    };
  } else if (avgGap <= 7) {
    return {
      status: "warning",
      averageGapDays: avgGap,
      recommendation: "Good consistency, but consider uploading more frequently. Best growth: 1 video/day or every 2 days.",
    };
  } else {
    return {
      status: "error",
      averageGapDays: avgGap,
      recommendation: "Large gaps detected between uploads. Try to maintain a consistent schedule for better algorithm performance.",
    };
  }
}

export function analyzeHookQuality(videos: VideoData[]): AnalysisResult["hookQuality"] {
  // Basic analysis based on title patterns
  const engagingPatterns = [
    /^how to/i,
    /\d+ ways/i,
    /secret/i,
    /\?$/,
    /you won't believe/i,
    /this is why/i,
    /never/i,
    /always/i,
    /best/i,
    /worst/i,
  ];

  let engagingCount = 0;
  videos.forEach(video => {
    if (engagingPatterns.some(pattern => pattern.test(video.title))) {
      engagingCount++;
    }
  });

  const engagingRatio = engagingCount / videos.length;

  if (engagingRatio >= 0.6) {
    return {
      status: "success",
      assessment: "Your titles use engaging patterns that tend to perform well. Keep it up!",
      sampleHook: "I discovered something that changed everything about my content strategy—and it took me 2 years to figure out...",
    };
  } else if (engagingRatio >= 0.3) {
    return {
      status: "info",
      assessment: "Your titles are average. Consider using more curiosity-driven or value-focused hooks.",
      sampleHook: "Most creators make this ONE mistake that kills their growth. Here's what to do instead...",
    };
  } else {
    return {
      status: "warning",
      assessment: "Your titles could be more engaging. Strong hooks in the first 2-3 seconds decide viewer retention.",
      sampleHook: "Stop scrolling—this video will save you hours of wasted effort. Let me show you...",
    };
  }
}

export function generateSEODescription(channelName: string, videos: VideoData[]): string {
  const recentTitles = videos.slice(0, 3).map(v => v.title).join(", ");
  
  return `Welcome to ${channelName}! In this video, we dive deep into proven strategies and insights. Recent content includes: ${recentTitles}. Subscribe for more actionable tips and content that helps you grow. Don't forget to like, comment, and hit the notification bell!`;
}

export function generateTags(videos: VideoData[]): string {
  // Extract common words from titles
  const words = videos
    .flatMap(v => v.title.toLowerCase().split(/\s+/))
    .filter(w => w.length > 3)
    .filter(w => !["this", "that", "with", "from", "have", "what", "when", "where", "which", "their", "they", "your", "about"].includes(w));
  
  const wordCounts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
  
  return topWords.join(", ") + ", youtube tips, content creator, grow channel";
}

export function generateHashtags(videos: VideoData[]): string {
  const tags = generateTags(videos).split(", ").slice(0, 5);
  return tags.map(t => `#${t.replace(/\s+/g, "")}`).join(" ");
}
