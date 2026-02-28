import { useState } from 'react';
import type { Product } from '../../../types/product';

export const useProductSort = (products: Product[]) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sorted = [...products].sort((a, b) => {
        const ta = a.dateOfProduction ? new Date(a.dateOfProduction).getTime() : 0;
        const tb = b.dateOfProduction ? new Date(b.dateOfProduction).getTime() : 0;
        return sortOrder === 'asc' ? ta - tb : tb - ta;
    });

    const toggleSort = () => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'));

    return { sorted, sortOrder, toggleSort };
};
