import { VideoData } from "@/lib/youtube";
import { formatDistanceToNow } from "date-fns";

interface VideoThumbnailGridProps {
  videos: VideoData[];
}

export const VideoThumbnailGrid = ({ videos }: VideoThumbnailGridProps) => {
  if (videos.length === 0) return null;

  return (
    <div className="card-elevated p-6 mb-6 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
        Your Last {videos.length} Videos (Live Data)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {videos.slice(0, 10).map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 group-hover:text-foreground transition-colors">
              {video.title}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};
