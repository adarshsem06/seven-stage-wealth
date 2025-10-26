-- Add monthly_income and expenses columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN monthly_income NUMERIC DEFAULT 0,
ADD COLUMN expenses JSONB DEFAULT '[]'::jsonb;

-- Update the timestamp trigger for the new columns
COMMENT ON COLUMN public.profiles.monthly_income IS 'User monthly income in rupees';
COMMENT ON COLUMN public.profiles.expenses IS 'User expenses stored as JSON array';
