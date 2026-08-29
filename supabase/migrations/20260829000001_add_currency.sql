-- =============================================================================
-- Migration: 20260829000001_add_currency.sql
-- Description: Add currency support (TZS, USD) to accounts and transactions tables
-- =============================================================================

-- Add currency column to accounts table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'accounts' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.accounts 
        ADD COLUMN currency TEXT NOT NULL DEFAULT 'TZS' CHECK (currency IN ('TZS', 'USD'));
    END IF;
END $$;

-- Add currency column to transactions table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'transactions' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.transactions 
        ADD COLUMN currency TEXT NOT NULL DEFAULT 'TZS' CHECK (currency IN ('TZS', 'USD'));
    END IF;
END $$;
