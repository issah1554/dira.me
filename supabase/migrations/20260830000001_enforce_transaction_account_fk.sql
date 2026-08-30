-- Replace the legacy free-text account value with an enforced account reference.
-- This migration intentionally fails at SET NOT NULL if an existing transaction
-- cannot be matched to an account owned by the same user.

ALTER TABLE public.accounts
    ADD CONSTRAINT accounts_id_user_id_key UNIQUE (id, user_id);

ALTER TABLE public.transactions
    ADD COLUMN account_id UUID;

UPDATE public.transactions AS transaction
SET account_id = account.id
FROM public.accounts AS account
WHERE transaction.user_id = account.user_id
  AND transaction.account = account.id::TEXT;

UPDATE public.transactions AS transaction
SET account_id = matched_account.id
FROM (
    SELECT user_id, lower(trim(name)) AS normalized_name, min(id::TEXT)::UUID AS id
    FROM public.accounts
    GROUP BY user_id, lower(trim(name))
    HAVING count(*) = 1
) AS matched_account
WHERE transaction.account_id IS NULL
  AND transaction.user_id = matched_account.user_id
  AND lower(trim(transaction.account)) = matched_account.normalized_name;

ALTER TABLE public.transactions
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN account_id SET NOT NULL;

ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_account_owner_fk
    FOREIGN KEY (account_id, user_id)
    REFERENCES public.accounts (id, user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

CREATE INDEX idx_transactions_account_id
    ON public.transactions (account_id);

ALTER TABLE public.transactions
    DROP COLUMN account;
