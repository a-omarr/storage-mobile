import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { SECTION_MAP } from '../../constants/sections';

export const useAllProducts = () => {
    const { products, loading } = useProducts();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = products.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.type.toLowerCase().includes(term) ||
            p.batchNumber.toLowerCase().includes(term) ||
            (SECTION_MAP[p.section as keyof typeof SECTION_MAP]?.label || '').toLowerCase().includes(term)
        );
    });

    const sorted = [...filtered]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => {
            const ta = a.dateOfProduction.toMillis();
            const tb = b.dateOfProduction.toMillis();
            return sortOrder === 'asc' ? ta - tb : tb - ta;
        });

    const toggleSort = () => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));

    return { sorted, loading, sortOrder, toggleSort, searchTerm, setSearchTerm };
};
