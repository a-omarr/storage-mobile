import { useEffect, useState } from 'react';
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product, SectionKey } from '../types/product';

interface SectionState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

/**
 * Fetch products for a specific section in real-time
 */
export function useSection(section: SectionKey | null): SectionState {
    const [state, setState] = useState<SectionState>({
        products: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!section) {
            setState({ products: [], loading: false, error: null });
            return;
        }

        const q = query(
            collection(db, 'products'),
            where('section', '==', section),
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
                console.error('useSection error:', err);
                setState((s) => ({ ...s, loading: false, error: err.message }));
            }
        );

        return () => unsub();
    }, [section]);

    return state;
}
