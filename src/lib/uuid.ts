// src/lib/uuid.ts

/**
 * Generates a valid RFC4122 version 4 UUID.
 * Works seamlessly in secure contexts (HTTPS/localhost), insecure contexts (LAN IP HTTP),
 * Node.js, and older WebViews without throwing errors.
 */
export function generateUUID(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        try {
            return crypto.randomUUID();
        } catch {
            // Fall through to getRandomValues fallback
        }
    }

    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        try {
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);
            bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
            bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
            const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
            return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
        } catch {
            // Fall through to Math.random fallback
        }
    }

    // Math.random fallback conforming strictly to RFC4122 v4 pattern
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Validates if a string is a valid UUID (v1-v5 format).
 */
export function isValidUUID(str: string | undefined | null): boolean {
    if (!str || typeof str !== "string") return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}
