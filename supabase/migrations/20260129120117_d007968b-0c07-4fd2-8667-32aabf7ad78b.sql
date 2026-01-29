-- Add last_video_analysis column to track daily limit
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS last_video_analysis timestamp with time zone;

-- Add comment for clarity
COMMENT ON COLUMN public.user_preferences.last_video_analysis IS 'Tracks when user last used single video analyzer for daily limit';