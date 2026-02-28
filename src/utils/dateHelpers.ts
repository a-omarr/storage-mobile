/**
 * Format an ISO date string to DD/MM/YYYY
 */
export function formatDate(ts: string | null | undefined): string {
    if (!ts) return '—';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '—';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Convert a Date object to an ISO string (replaces Firestore Timestamp.fromDate)
 */
export function dateToISOString(date: Date): string {
    return date.toISOString();
}

/**
 * Parse a date string in various formats to a Date object
 * Handles: YYYY-MM-DD, DD/MM/YYYY, MM/YYYY
 */
export function parseOCRDate(raw: string): Date | null {
    raw = raw.trim();

    // DD/MM/YYYY
    const dmy = raw.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (dmy) {
        const d = new Date(parseInt(dmy[3]), parseInt(dmy[2]) - 1, parseInt(dmy[1]));
        if (!isNaN(d.getTime())) return d;
    }

    // YYYY-MM-DD
    const ymd = raw.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
    if (ymd) {
        const d = new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
        if (!isNaN(d.getTime())) return d;
    }

    // MM/YYYY
    const my = raw.match(/^(\d{1,2})[\/\-\.](\d{4})$/);
    if (my) {
        const d = new Date(parseInt(my[2]), parseInt(my[1]) - 1, 1);
        if (!isNaN(d.getTime())) return d;
    }

    return null;
}

/**
 * Get how many days old a product is (from its ISO date string)
 */
export function daysOld(ts: string | null | undefined): number {
    if (!ts) return 0;
    const then = new Date(ts).getTime();
    if (isNaN(then)) return 0;
    return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
}

