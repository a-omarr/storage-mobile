import { useEffect, useState } from 'react';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types/product';

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

/**
 * Fetch ALL products in real-time, ordered by dateOfProduction ascending
 */
export function useProducts(): ProductsState {
    const [state, setState] = useState<ProductsState>({
        products: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const q = query(
            collection(db, 'products'),
            orderBy('dateOfProduction', 'asc')
        );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const products: Product[] = snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];
                setState({ products, loading: false, error: null });
            },
            (err) => {
                console.error('useProducts error:', err);
                setState((s) => ({ ...s, loading: false, error: err.message }));
            }
        );

        return () => unsub();
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
