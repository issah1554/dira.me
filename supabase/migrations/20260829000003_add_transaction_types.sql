-- =============================================================================
-- Migration: Add explicit transaction types
-- Types: income, expense, transfer, borrow, repayment
-- =============================================================================

-- 1. Add type column to transactions table with check constraint
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'expense'
CHECK (type IN ('income', 'expense', 'transfer', 'borrow', 'repayment'));

-- 2. Backfill existing records based on dc
UPDATE public.transactions
SET type = CASE
    WHEN dc = 'cr' THEN 'income'
    ELSE 'expense'
END
WHERE type IS NULL OR type = 'expense';

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
