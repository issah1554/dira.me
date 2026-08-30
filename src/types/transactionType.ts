// src/types/transactionType.ts
import type { TransactionType } from "./database";

export interface TransactionTypeItem {
    id: string;
    userId?: string;
    code: TransactionType | string;
    label: string;
    dc: "dr" | "cr";
    icon: string;
    badge: string;
    color: string;
    description: string;
    isSystem?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface TransactionTypeCreateDTO {
    code: string;
    label: string;
    dc: "dr" | "cr";
    icon?: string;
    color?: string;
    description?: string;
}

export interface TransactionTypeUpdateDTO {
    label?: string;
    dc?: "dr" | "cr";
    icon?: string;
    color?: string;
    description?: string;
}
