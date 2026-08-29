// src/types/party.ts

export type PartyType =
    | "person"
    | "company"
    | "employer"
    | "customer"
    | "merchant"
    | "bank"
    | "government"
    | "other";

export interface Party {
    id: string;
    userId?: string;
    name: string;
    type: PartyType;
    phone?: string;
    email?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PartyCreateDTO {
    name: string;
    type: PartyType;
    phone?: string;
    email?: string;
    notes?: string;
}

export interface PartyUpdateDTO {
    name?: string;
    type?: PartyType;
    phone?: string;
    email?: string;
    notes?: string;
}
