import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { SECTION_MAP } from '../../constants/sections';

export const useAllProducts = () => {
    const { products, loading } = useProducts();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const flattenedProducts = products.flatMap(p => {
        if (!p.sections || p.sections.length === 0) {
            // Handle edge case where a product has no section
            return [{ ...p, displaySection: null as any }];
        }
        return p.sections.map(sec => ({
            ...p,
            displaySection: sec
        }));
    });

    const filtered = flattenedProducts.filter((p) => {
        const term = searchTerm.toLowerCase();
        const sectionMatch = p.displaySection
            ? (SECTION_MAP[p.displaySection as keyof typeof SECTION_MAP]?.label || '').toLowerCase().includes(term)
            : false;

        return (
            p.type.toLowerCase().includes(term) ||
            p.batchNumber.toLowerCase().includes(term) ||
            sectionMatch
        );
    });

    const sorted = [...filtered]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => {
            const ta = new Date(a.dateOfProduction).getTime();
            const tb = new Date(b.dateOfProduction).getTime();
            return sortOrder === 'asc' ? ta - tb : tb - ta;
        });

    const toggleSort = () => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));

    return { sorted, loading, sortOrder, toggleSort, searchTerm, setSearchTerm };
};
