-- Create ratings table for storing user ratings and feedback
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  page_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to insert ratings
CREATE POLICY "Users can insert their own ratings"
ON public.ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own ratings
CREATE POLICY "Users can view their own ratings"
ON public.ratings
FOR SELECT
USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX idx_ratings_created_at ON public.ratings(created_at DESC);