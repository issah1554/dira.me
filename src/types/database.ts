// types/database.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            accounts: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    type: string;
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
            transactions: {
                Row: {
                    id: string;
                    user_id?: string;
                    date: string;
                    amount: number;
                    dc: "dr" | "cr";
                    account: string;
                    notes: string;
                    category: string;
                    status: "completed" | "pending" | "failed";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string;
                    date: string;
                    amount: number;
                    dc: "dr" | "cr";
                    account: string;
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
                    dc?: "dr" | "cr";
                    account?: string;
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
    dc: "dr" | "cr";
    notes: string;
    account: string;
    category: string;
    status: "completed" | "pending" | "failed";
    createdAt: string;
    updatedAt: string;
    userId?: string;
}

export interface TransactionFormData {
    date: string;
    amount: number;
    dc: "dr" | "cr";
    notes: string;
    account: string;
    category: string;
    status?: "completed" | "pending" | "failed";
}

export type TransactionFilter = {
    status?: "completed" | "pending" | "failed";
    account?: string;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
};
