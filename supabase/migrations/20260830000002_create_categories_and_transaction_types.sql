-- =============================================================================
-- Migration: 20260830000002_create_categories_and_transaction_types.sql
-- Description: Create transaction_categories & transaction_types tables with RLS
-- =============================================================================

-- 1. Transaction Categories Table
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

-- Categories Indexes
CREATE INDEX IF NOT EXISTS idx_tx_categories_user_id ON public.transaction_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tx_categories_name ON public.transaction_categories(name);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_tx_categories_updated_at ON public.transaction_categories;
CREATE TRIGGER set_tx_categories_updated_at
    BEFORE UPDATE ON public.transaction_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies for Categories
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;

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


-- 2. Transaction Types Table
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

-- Types Indexes
CREATE INDEX IF NOT EXISTS idx_tx_types_user_id ON public.transaction_types(user_id);
CREATE INDEX IF NOT EXISTS idx_tx_types_code ON public.transaction_types(code);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_tx_types_updated_at ON public.transaction_types;
CREATE TRIGGER set_tx_types_updated_at
    BEFORE UPDATE ON public.transaction_types
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies for Types
ALTER TABLE public.transaction_types ENABLE ROW LEVEL SECURITY;

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
