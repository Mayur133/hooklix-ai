-- Create a security definer function to check if a user is premium
CREATE OR REPLACE FUNCTION public.is_user_premium(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = check_user_id
      AND is_premium = true
      AND (premium_until IS NULL OR premium_until > now())
  )
$$;

-- Drop the existing INSERT policy for analysis_history
DROP POLICY IF EXISTS "Users can create their own analysis history" ON public.analysis_history;

-- Create a new INSERT policy that enforces premium for comparison analysis type
CREATE POLICY "Users can create their own analysis history"
ON public.analysis_history
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    analysis_type != 'comparison'
    OR public.is_user_premium(auth.uid())
  )
);