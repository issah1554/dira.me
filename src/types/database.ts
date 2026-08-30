// types/database.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type CurrencyCode = "TZS" | "USD";

export type PartyType =
    | "person"
    | "company"
    | "employer"
    | "customer"
    | "merchant"
    | "bank"
    | "government"
    | "other";

export type TransactionType =
    | "income"
    | "expense"
    | "transfer"
    | "borrow"
    | "repayment"
    | "lend"
    | "collection";

export interface Database {
    public: {
        Tables: {
            accounts: {
                Row: {
                    id: string;
                    user_id?: string;
                    name: string;
                    type: string;
                    currency: CurrencyCode;
                    opening_balance: number;
                    current_balance: number;
                    account_number: string;
                    status: "active" | "inactive" | "pending";
                    description: string;
                    icon: string;
                    last_transaction: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    type: string;
                    currency?: CurrencyCode;
                    opening_balance?: number;
                    current_balance?: number;
                    account_number?: string;
                    status?: "active" | "inactive" | "pending";
                    description?: string;
                    icon?: string;
                    last_transaction?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    type?: string;
                    currency?: CurrencyCode;
                    opening_balance?: number;
                    current_balance?: number;
                    account_number?: string;
                    status?: "active" | "inactive" | "pending";
                    description?: string;
                    icon?: string;
                    last_transaction?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            parties: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    type: PartyType;
                    phone: string;
                    email: string;
                    notes: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    type?: PartyType;
                    phone?: string;
                    email?: string;
                    notes?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    type?: PartyType;
                    phone?: string;
                    email?: string;
                    notes?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            transactions: {
                Row: {
                    id: string;
                    user_id?: string;
                    date: string;
                    amount: number;
                    type: TransactionType;
                    dc: "dr" | "cr";
                    account_id: string;
                    party_id?: string | null;
                    transfer_id?: string | null;
                    currency: CurrencyCode;
                    notes: string;
                    category: string;
                    status: "completed" | "pending" | "failed";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    date: string;
                    amount: number;
                    type?: TransactionType;
                    dc?: "dr" | "cr";
                    account_id: string;
                    party_id?: string | null;
                    transfer_id?: string | null;
                    currency?: CurrencyCode;
                    notes?: string;
                    category?: string;
                    status?: "completed" | "pending" | "failed";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    date?: string;
                    amount?: number;
                    type?: TransactionType;
                    dc?: "dr" | "cr";
                    account_id?: string;
                    party_id?: string | null;
                    transfer_id?: string | null;
                    currency?: CurrencyCode;
                    notes?: string;
                    category?: string;
                    status?: "completed" | "pending" | "failed";
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

export interface DbTransaction {
    id: string;
    date: string;
    amount: number;
    type: TransactionType;
    dc: "dr" | "cr";
    notes: string;
    accountId: string;
    party_id?: string | null;
    currency?: CurrencyCode;
    category: string;
    status: "completed" | "pending" | "failed";
    createdAt: string;
    updatedAt: string;
    userId?: string;
}

export interface TransactionFormData {
    date: string;
    amount: number;
    type: TransactionType;
    dc: "dr" | "cr";
    notes: string;
    accountId: string;
    party_id?: string | null;
    currency?: CurrencyCode;
    category: string;
    status?: "completed" | "pending" | "failed";
}

export type TransactionFilter = {
    status?: "completed" | "pending" | "failed";
    type?: TransactionType;
    accountId?: string;
    party_id?: string;
    currency?: CurrencyCode;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
};
