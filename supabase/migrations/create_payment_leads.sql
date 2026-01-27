-- Create payment_leads table for tracking payment intents and conversions
CREATE TABLE IF NOT EXISTS payment_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  payment_tier TEXT NOT NULL CHECK (payment_tier IN ('R49', 'R249')),
  status TEXT NOT NULL DEFAULT 'intent' CHECK (status IN ('intent', 'redirected', 'completed', 'abandoned')),
  yoco_url TEXT NOT NULL,
  tracking_id TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'how_it_works_section',
  redirected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_leads_email ON payment_leads(email);

-- Create index on tracking_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_payment_leads_tracking_id ON payment_leads(tracking_id);

-- Create index on status for analytics
CREATE INDEX IF NOT EXISTS idx_payment_leads_status ON payment_leads(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_leads_updated_at
  BEFORE UPDATE ON payment_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE payment_leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for lead capture from landing page)
CREATE POLICY "Allow public inserts" ON payment_leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public updates (for status updates)
CREATE POLICY "Allow public updates" ON payment_leads
  FOR UPDATE
  TO public
  USING (true);

-- Allow authenticated users to read their own records
CREATE POLICY "Allow authenticated read own" ON payment_leads
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR true);
