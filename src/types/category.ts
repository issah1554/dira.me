// src/types/category.ts

export interface TransactionCategory {
    id: string;
    userId?: string;
    name: string;
    description?: string; // Examples or descriptive context (e.g., "Fuel, bus, taxi")
    icon?: string;        // Bootstrap icon class (e.g. "bi-car-front")
    color?: string;       // Color theme / Tailwind color name (e.g. "emerald", "blue", "amber")
    isSystem?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CategoryCreateDTO {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
}

export interface CategoryUpdateDTO {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
}
