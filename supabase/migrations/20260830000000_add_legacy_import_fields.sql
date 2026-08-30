-- Preserve source identifiers and unmodeled values during legacy imports.
ALTER TABLE public.accounts
    ADD COLUMN IF NOT EXISTS legacy_source TEXT,
    ADD COLUMN IF NOT EXISTS legacy_data JSONB;

ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS legacy_source TEXT,
    ADD COLUMN IF NOT EXISTS legacy_cash_in NUMERIC(15, 2),
    ADD COLUMN IF NOT EXISTS legacy_cash_out NUMERIC(15, 2),
    ADD COLUMN IF NOT EXISTS legacy_balance NUMERIC(15, 2),
    ADD COLUMN IF NOT EXISTS legacy_bill TEXT,
    ADD COLUMN IF NOT EXISTS legacy_data JSONB;

