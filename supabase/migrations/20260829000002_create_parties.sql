-- =============================================================================
-- Migration: 20260829000002_create_parties.sql
-- Description: Create parties table (person, company, employer, customer, merchant, bank, government, other) and link to transactions
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'person' CHECK (type IN ('person', 'company', 'employer', 'customer', 'merchant', 'bank', 'government', 'other')),
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for parties.updated_at
DROP TRIGGER IF EXISTS set_parties_updated_at ON public.parties;
CREATE TRIGGER set_parties_updated_at
    BEFORE UPDATE ON public.parties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for parties
CREATE INDEX IF NOT EXISTS idx_parties_user_id ON public.parties(user_id);
CREATE INDEX IF NOT EXISTS idx_parties_type ON public.parties(type);
CREATE INDEX IF NOT EXISTS idx_parties_name ON public.parties(name);

-- Enable RLS
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;

-- Parties Policies
DROP POLICY IF EXISTS "Users can view their own parties" ON public.parties;
CREATE POLICY "Users can view their own parties"
    ON public.parties FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own parties" ON public.parties;
CREATE POLICY "Users can create their own parties"
    ON public.parties FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own parties" ON public.parties;
CREATE POLICY "Users can update their own parties"
    ON public.parties FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own parties" ON public.parties;
CREATE POLICY "Users can delete their own parties"
    ON public.parties FOR DELETE
    USING (auth.uid() = user_id);

-- Add party_id to transactions table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'transactions' 
        AND column_name = 'party_id'
    ) THEN
        ALTER TABLE public.transactions 
        ADD COLUMN party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_transactions_party_id ON public.transactions(party_id);
    END IF;
END $$;
