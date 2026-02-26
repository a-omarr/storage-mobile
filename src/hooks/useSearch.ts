import { useMemo, useState } from 'react';
import type { Product } from '../types/product';

/**
 * Client-side search across all products
 * Searches: type, itemNo, batchNumber, color, capacity
 */
export function useSearch(products: Product[]) {
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return products.filter((p) => {
            return (
                p.type?.toLowerCase().includes(q) ||
                p.itemNo?.toLowerCase().includes(q) ||
                p.batchNumber?.toLowerCase().includes(q) ||
                p.color?.toLowerCase().includes(q) ||
                p.capacity?.toLowerCase().includes(q) ||
                p.finishType?.toLowerCase().includes(q)
            );
        });
    }, [products, query]);

    return { query, setQuery, results };
}
