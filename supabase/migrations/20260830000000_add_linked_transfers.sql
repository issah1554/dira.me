-- Link the debit and credit rows that make up an account-to-account transfer.
ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS transfer_id UUID;

CREATE INDEX IF NOT EXISTS idx_transactions_transfer_id
    ON public.transactions (transfer_id)
    WHERE transfer_id IS NOT NULL;

