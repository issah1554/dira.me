-- =============================================================================
-- Migration: 20260905000000_permanent_categories_and_fk.sql
-- Description:
--   1. Seed 14 default categories & 7 transaction types permanently for all existing users
--   2. Add handle_new_user_setup() trigger on auth.users so all future users get them automatically
--   3. Add category_id UUID FOREIGN KEY to transactions referencing transaction_categories(id)
--   4. Backfill category_id on existing transactions
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Ensure Foreign Key Column in Transactions Table
-- -----------------------------------------------------------------------------

ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.transaction_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);

-- -----------------------------------------------------------------------------
-- 2. Seed Default Categories Permanently for All Existing Users
-- -----------------------------------------------------------------------------

INSERT INTO public.transaction_categories (user_id, name, description, icon, color, is_system)
SELECT u.id, def.name, def.description, def.icon, def.color, true
FROM auth.users u
CROSS JOIN (
    VALUES
        ('Salary', 'Job salary, wages', 'bi-cash-stack', 'emerald'),
        ('Business', 'Business revenue', 'bi-briefcase', 'blue'),
        ('Freelance', 'Contract/project income', 'bi-laptop', 'teal'),
        ('Food', 'Groceries, restaurants', 'bi-egg-fried', 'amber'),
        ('Transport', 'Fuel, bus, taxi', 'bi-car-front', 'orange'),
        ('Housing', 'Rent, repairs', 'bi-house-door', 'indigo'),
        ('Utilities', 'Electricity, water, internet', 'bi-lightning-charge', 'yellow'),
        ('Shopping', 'Clothes, electronics', 'bi-cart', 'pink'),
        ('Entertainment', 'Movies, games', 'bi-controller', 'purple'),
        ('Education', 'Courses, books, fees', 'bi-mortarboard', 'sky'),
        ('Family', 'Family support', 'bi-people', 'rose'),
        ('Gifts', 'Gifts given/received', 'bi-gift', 'red'),
        ('Fees', 'Bank/mobile-money charges', 'bi-credit-card', 'gray'),
        ('Other', 'Anything uncategorized', 'bi-question-circle', 'neutral')
) AS def(name, description, icon, color)
ON CONFLICT (user_id, name) DO UPDATE 
    SET description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        is_system = true;

-- -----------------------------------------------------------------------------
-- 3. Seed Default Transaction Types Permanently for All Existing Users
-- -----------------------------------------------------------------------------

INSERT INTO public.transaction_types (user_id, code, label, dc, icon, color, badge, description, is_system)
SELECT u.id, def.code, def.label, def.dc, def.icon, def.color, def.badge, def.description, true
FROM auth.users u
CROSS JOIN (
    VALUES
        ('income', 'Income', 'cr', 'bi-arrow-down-left-circle-fill', 'text-success-600', 'bg-success-100 text-success-800 border border-success-300', 'Money received (Salary, Sales, Grants, Gifts)'),
        ('expense', 'Expense', 'dr', 'bi-arrow-up-right-circle-fill', 'text-danger-600', 'bg-danger-100 text-danger-800 border border-danger-300', 'Money spent (Rent, Groceries, Utilities, Supplies)'),
        ('transfer', 'Transfer', 'dr', 'bi-arrow-left-right', 'text-primary-600', 'bg-primary-100 text-primary-800 border border-primary-300', 'Moving money between accounts or digital wallets'),
        ('borrow', 'Borrow', 'cr', 'bi-box-arrow-in-down-right', 'text-accent-600', 'bg-accent-100 text-accent-800 border border-accent-300', 'Money received or borrowed from a party (payable/liability)'),
        ('repayment', 'Repayment', 'dr', 'bi-box-arrow-up-right', 'text-secondary-600', 'bg-secondary-100 text-secondary-800 border border-secondary-300', 'Paying back a borrowed amount or debt'),
        ('lend', 'Lend', 'dr', 'bi-box-arrow-up-left', 'text-warning-600', 'bg-warning-100 text-warning-800 border border-warning-300', 'Money lent out to a person or entity (receivable created)'),
        ('collection', 'Collection', 'cr', 'bi-box-arrow-in-down-left', 'text-info-600', 'bg-info-100 text-info-800 border border-info-300', 'Collecting money that was lent out (receivable recovered)')
) AS def(code, label, dc, icon, color, badge, description)
ON CONFLICT (user_id, code) DO UPDATE 
    SET label = EXCLUDED.label,
        dc = EXCLUDED.dc,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        badge = EXCLUDED.badge,
        description = EXCLUDED.description,
        is_system = true;

-- -----------------------------------------------------------------------------
-- 4. Automatically Provision Categories and Types on New User Signup
-- -----------------------------------------------------------------------------

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

-- -----------------------------------------------------------------------------
-- 5. Backfill category_id on Existing Transactions
-- -----------------------------------------------------------------------------

UPDATE public.transactions t
SET category_id = c.id
FROM public.transaction_categories c
WHERE t.user_id = c.user_id
  AND LOWER(TRIM(t.category)) = LOWER(TRIM(c.name))
  AND t.category_id IS NULL;
