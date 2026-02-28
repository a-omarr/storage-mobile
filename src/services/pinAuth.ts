import { getDB, saveWebStore } from '../db/database';

/**
 * Hash a PIN using the Web Crypto API (SHA-256).
 * 100% offline, no library needed.
 */
export async function hashPin(pin: string): Promise<string> {
    const buffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(pin)
    );
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Check if a PIN hash exists in app_settings.
 */
export async function isPinSet(): Promise<boolean> {
    const db = await getDB();
    const result = await db.query("SELECT value FROM app_settings WHERE key = 'pin_hash';");
    return !!(result.values && result.values.length > 0);
}

/**
 * Hash and save a new PIN to app_settings.
 */
export async function setPin(pin: string): Promise<void> {
    const db = await getDB();
    const hash = await hashPin(pin);
    await db.execute(`INSERT OR REPLACE INTO app_settings (key, value) VALUES ('pin_hash', '${hash}');`);
    await saveWebStore();
}

/**
 * Hash the input and compare to stored hash.
 */
export async function verifyPin(pin: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.query("SELECT value FROM app_settings WHERE key = 'pin_hash';");
    if (!result.values || result.values.length === 0) return false;

    const storedHash = result.values[0].value;
    const inputHash = await hashPin(pin);
    return inputHash === storedHash;
}

/**
 * Remove the stored PIN hash.
 */
export async function clearPin(): Promise<void> {
    const db = await getDB();
    await db.execute("DELETE FROM app_settings WHERE key = 'pin_hash';");
    await saveWebStore();
}
