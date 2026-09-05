-- =============================================================================
-- Dira.me Supabase Schema & Security Setup
-- Run this script in the Supabase SQL Editor to create tables and RLS policies.
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. Helper Functions
-- =============================================================================

-- Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 2. Accounts Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TZS' CHECK (currency IN ('TZS', 'USD')),
    opening_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    account_number TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    description TEXT DEFAULT '',
    icon TEXT DEFAULT 'bi-wallet2',
    last_transaction DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (id, user_id)
);

-- Trigger for accounts.updated_at
DROP TRIGGER IF EXISTS set_accounts_updated_at ON public.accounts;
CREATE TRIGGER set_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for accounts
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON public.accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON public.accounts(created_at DESC);

-- Enable RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Accounts RLS Policies
DROP POLICY IF EXISTS "Users can view their own accounts" ON public.accounts;
CREATE POLICY "Users can view their own accounts"
    ON public.accounts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own accounts" ON public.accounts;
CREATE POLICY "Users can create their own accounts"
    ON public.accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own accounts" ON public.accounts;
CREATE POLICY "Users can update their own accounts"
    ON public.accounts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own accounts" ON public.accounts;
CREATE POLICY "Users can delete their own accounts"
    ON public.accounts FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- 3. Parties Table
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

-- =============================================================================
-- =============================================================================
-- 4. Transaction Categories Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.transaction_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT 'bi-tag',
    color TEXT DEFAULT 'primary',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_category_name UNIQUE (user_id, name)
);

-- Trigger for transaction_categories.updated_at
DROP TRIGGER IF EXISTS set_tx_categories_updated_at ON public.transaction_categories;
CREATE TRIGGER set_tx_categories_updated_at
    BEFORE UPDATE ON public.transaction_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_tx_categories_user_id ON public.transaction_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tx_categories_name ON public.transaction_categories(name);

-- Enable RLS
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;

-- Category Policies
DROP POLICY IF EXISTS "Users can view own categories" ON public.transaction_categories;
CREATE POLICY "Users can view own categories"
    ON public.transaction_categories FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own categories" ON public.transaction_categories;
CREATE POLICY "Users can insert own categories"
    ON public.transaction_categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own categories" ON public.transaction_categories;
CREATE POLICY "Users can update own categories"
    ON public.transaction_categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own categories" ON public.transaction_categories;
CREATE POLICY "Users can delete own categories"
    ON public.transaction_categories FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- 5. Transaction Types Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.transaction_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    dc TEXT NOT NULL CHECK (dc IN ('dr', 'cr')),
    icon TEXT DEFAULT 'bi-arrow-left-right',
    color TEXT DEFAULT 'primary',
    badge TEXT DEFAULT '',
    description TEXT DEFAULT '',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_type_code UNIQUE (user_id, code)
);

-- Trigger for transaction_types.updated_at
DROP TRIGGER IF EXISTS set_tx_types_updated_at ON public.transaction_types;
CREATE TRIGGER set_tx_types_updated_at
    BEFORE UPDATE ON public.transaction_types
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for transaction types
CREATE INDEX IF NOT EXISTS idx_tx_types_user_id ON public.transaction_types(user_id);
CREATE INDEX IF NOT EXISTS idx_tx_types_code ON public.transaction_types(code);

-- Enable RLS
ALTER TABLE public.transaction_types ENABLE ROW LEVEL SECURITY;

-- Type Policies
DROP POLICY IF EXISTS "Users can view own types" ON public.transaction_types;
CREATE POLICY "Users can view own types"
    ON public.transaction_types FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own types" ON public.transaction_types;
CREATE POLICY "Users can insert own types"
    ON public.transaction_types FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own types" ON public.transaction_types;
CREATE POLICY "Users can update own types"
    ON public.transaction_types FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own types" ON public.transaction_types;
CREATE POLICY "Users can delete own types"
    ON public.transaction_types FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- 6. Transactions Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    type TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense', 'transfer', 'borrow', 'repayment', 'lend', 'collection')),
    dc TEXT NOT NULL CHECK (dc IN ('dr', 'cr')),
    account_id UUID NOT NULL,
    party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.transaction_categories(id) ON DELETE SET NULL,
    transfer_id UUID,
    currency TEXT NOT NULL DEFAULT 'TZS' CHECK (currency IN ('TZS', 'USD')),
    notes TEXT DEFAULT '',
    category TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT transactions_account_owner_fk
        FOREIGN KEY (account_id, user_id)
        REFERENCES public.accounts (id, user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Trigger for transactions.updated_at
DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.transactions;
CREATE TRIGGER set_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_party_id ON public.transactions(party_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transfer_id ON public.transactions(transfer_id) WHERE transfer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions RLS Policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;
CREATE POLICY "Users can create transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
CREATE POLICY "Users can update their own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;
CREATE POLICY "Users can delete their own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- =============================================================================
-- 7. Automated Provisioning for New Users
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Insert default categories for new user
    INSERT INTO public.transaction_categories (user_id, name, description, icon, color, is_system)
    VALUES
        (NEW.id, 'Salary', 'Job salary, wages', 'bi-cash-stack', 'emerald', true),
        (NEW.id, 'Business', 'Business revenue', 'bi-briefcase', 'blue', true),
        (NEW.id, 'Freelance', 'Contract/project income', 'bi-laptop', 'teal', true),
        (NEW.id, 'Food', 'Groceries, restaurants', 'bi-egg-fried', 'amber', true),
        (NEW.id, 'Transport', 'Fuel, bus, taxi', 'bi-car-front', 'orange', true),
        (NEW.id, 'Housing', 'Rent, repairs', 'bi-house-door', 'indigo', true),
        (NEW.id, 'Utilities', 'Electricity, water, internet', 'bi-lightning-charge', 'yellow', true),
        (NEW.id, 'Shopping', 'Clothes, electronics', 'bi-cart', 'pink', true),
        (NEW.id, 'Entertainment', 'Movies, games', 'bi-controller', 'purple', true),
        (NEW.id, 'Education', 'Courses, books, fees', 'bi-mortarboard', 'sky', true),
        (NEW.id, 'Family', 'Family support', 'bi-people', 'rose', true),
        (NEW.id, 'Gifts', 'Gifts given/received', 'bi-gift', 'red', true),
        (NEW.id, 'Fees', 'Bank/mobile-money charges', 'bi-credit-card', 'gray', true),
        (NEW.id, 'Other', 'Anything uncategorized', 'bi-question-circle', 'neutral', true)
    ON CONFLICT (user_id, name) DO NOTHING;

    -- 2. Insert default transaction types for new user
    INSERT INTO public.transaction_types (user_id, code, label, dc, icon, color, badge, description, is_system)
    VALUES
        (NEW.id, 'income', 'Income', 'cr', 'bi-arrow-down-left-circle-fill', 'text-success-600', 'bg-success-100 text-success-800 border border-success-300', 'Money received (Salary, Sales, Grants, Gifts)', true),
        (NEW.id, 'expense', 'Expense', 'dr', 'bi-arrow-up-right-circle-fill', 'text-danger-600', 'bg-danger-100 text-danger-800 border border-danger-300', 'Money spent (Rent, Groceries, Utilities, Supplies)', true),
        (NEW.id, 'transfer', 'Transfer', 'dr', 'bi-arrow-left-right', 'text-primary-600', 'bg-primary-100 text-primary-800 border border-primary-300', 'Moving money between accounts or digital wallets', true),
        (NEW.id, 'borrow', 'Borrow', 'cr', 'bi-box-arrow-in-down-right', 'text-accent-600', 'bg-accent-100 text-accent-800 border border-accent-300', 'Money received or borrowed from a party (payable/liability)', true),
        (NEW.id, 'repayment', 'Repayment', 'dr', 'bi-box-arrow-up-right', 'text-secondary-600', 'bg-secondary-100 text-secondary-800 border border-secondary-300', 'Paying back a borrowed amount or debt', true),
        (NEW.id, 'lend', 'Lend', 'dr', 'bi-box-arrow-up-left', 'text-warning-600', 'bg-warning-100 text-warning-800 border border-warning-300', 'Money lent out to a person or entity (receivable created)', true),
        (NEW.id, 'collection', 'Collection', 'cr', 'bi-box-arrow-in-down-left', 'text-info-600', 'bg-info-100 text-info-800 border border-info-300', 'Collecting money that was lent out (receivable recovered)', true)
    ON CONFLICT (user_id, code) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_setup ON auth.users;
CREATE TRIGGER on_auth_user_created_setup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_setup();


