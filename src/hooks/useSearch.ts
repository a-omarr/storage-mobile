import { useMemo, useState } from 'react';
import { SECTION_MAP } from '../constants/sections';
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

        const flattenedProducts = products.flatMap(p => {
            if (!p.sections || p.sections.length === 0) {
                return [{ ...p, displaySection: null as any }];
            }
            return p.sections.map(sec => ({
                ...p,
                displaySection: sec
            }));
        });

        return flattenedProducts.filter((p) => {
            const sectionLabel = p.displaySection
                ? (SECTION_MAP[p.displaySection as keyof typeof SECTION_MAP]?.label || '').toLowerCase()
                : '';

            return (
                p.type?.toLowerCase().includes(q) ||
                p.itemNo?.toLowerCase().includes(q) ||
                p.batchNumber?.toLowerCase().includes(q) ||
                p.color?.toLowerCase().includes(q) ||
                p.capacity?.toLowerCase().includes(q) ||
                p.finishType?.toLowerCase().includes(q) ||
                sectionLabel.includes(q)
            );
        });
    }, [products, query]);

    return { query, setQuery, results };
}
