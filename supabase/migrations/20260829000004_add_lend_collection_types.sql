-- =============================================================================
-- Migration: Add lend and collection transaction types
-- Types: income, expense, transfer, borrow, repayment, lend, collection
-- =============================================================================

-- 1. Drop existing check constraint if present and re-add updated constraint
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_type_check;

ALTER TABLE public.transactions
ADD CONSTRAINT transactions_type_check
CHECK (type IN ('income', 'expense', 'transfer', 'borrow', 'repayment', 'lend', 'collection'));
