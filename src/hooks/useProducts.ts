import { useEffect, useState } from 'react';
import { getAllProducts } from '../db/productService';
import type { Product } from '../types/product';

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

/**
 * Fetch ALL products, ordered by dateOfProduction ascending
 */
export function useProducts(): ProductsState {
    const [state, setState] = useState<ProductsState>({
        products: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;
        setState((s) => ({ ...s, loading: true }));

        getAllProducts()
            .then((products) => {
                if (!cancelled) setState({ products, loading: false, error: null });
            })
            .catch((err) => {
                console.error('useProducts error:', err);
                if (!cancelled)
                    setState((s) => ({ ...s, loading: false, error: String(err) }));
            });

        return () => { cancelled = true; };
    }, []);

    return state;
}

/**
 * Count products by section for dashboard
 */
export function useProductCounts(): Record<string, number> {
    const { products } = useProducts();
    const counts: Record<string, number> = {};
    for (const p of products) {
        if (p.sections && Array.isArray(p.sections)) {
            for (const section of p.sections) {
                counts[section] = (counts[section] || 0) + 1;
            }
        }
    }
    return counts;
}

