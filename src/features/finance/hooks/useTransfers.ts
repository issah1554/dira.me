import { useState, useEffect, useCallback } from 'react';
import { accountService } from '../services/accountService';
import type { Account, AccountCreateDTO, AccountUpdateDTO, AccountSummary } from '../../../types/account';
import { useAuth } from '../../../contexts/AuthContext';

export const useAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<AccountSummary>({
        totalBalance: 0,
        activeAccounts: 0,
        accountTypes: 0
    });

    const { user } = useAuth(); // Get current user from auth context

    // Load accounts
    const loadAccounts = useCallback(async () => {
        if (!user?.uid) return;

        setLoading(true);
        setError(null);

        try {
            const userAccounts = await accountService.getAccounts(user.uid);
            setAccounts(userAccounts);

            // Load summary
            const accountSummary = await accountService.getAccountSummary(user.uid);
            setSummary(accountSummary);
        } catch (err) {
            setError('Failed to load accounts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    // Create account
    const createAccount = async (accountData: AccountCreateDTO): Promise<Account> => {
        if (!user?.uid) throw new Error('User not authenticated');

        setLoading(true);
        setError(null);

        try {
            const newAccount = await accountService.createAccount(accountData, user.uid);

            // Update local state
            setAccounts(prev => [...prev, newAccount]);

            // Update summary
            const accountSummary = await accountService.getAccountSummary(user.uid);
            setSummary(accountSummary);

            return newAccount;
        } catch (err) {
            setError('Failed to create account');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update account
    const updateAccount = async (accountId: string, accountData: AccountUpdateDTO): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await accountService.updateAccount(accountId, accountData);

            // Update local state
            setAccounts(prev => prev.map(account =>
                account.id === accountId
                    ? { ...account, ...accountData }
                    : account
            ));

            if (user?.uid) {
                const accountSummary = await accountService.getAccountSummary(user.uid);
                setSummary(accountSummary);
            }
        } catch (err) {
            setError('Failed to update account');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete account
    const deleteAccount = async (accountId: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await accountService.deleteAccount(accountId);

            // Update local state
            setAccounts(prev => prev.filter(account => account.id !== accountId));

            if (user?.uid) {
                const accountSummary = await accountService.getAccountSummary(user.uid);
                setSummary(accountSummary);
            }
        } catch (err) {
            setError('Failed to delete account');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get account by ID
    const getAccountById = async (accountId: string): Promise<Account | null> => {
        try {
            return await accountService.getAccountById(accountId);
        } catch (err) {
            setError('Failed to fetch account');
            console.error(err);
            throw err;
        }
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Initialize on mount
    useEffect(() => {
        if (user?.uid) {
            loadAccounts();
        }
    }, [user?.uid, loadAccounts]);

    return {
        accounts,
        summary,
        loading,
        error,
        createAccount,
        updateAccount,
        deleteAccount,
        getAccountById,
        loadAccounts,
        formatCurrency
    };
};