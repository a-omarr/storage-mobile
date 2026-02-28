import { useProducts } from '../../hooks/useProducts';

export const useHome = () => {
    const { products, loading } = useProducts();

    let totalCount = 0;
    const counts: Record<string, number> = {};
    for (const p of products) {
        if (p.sections && Array.isArray(p.sections)) {
            for (const section of p.sections) {
                counts[section] = (counts[section] || 0) + 1;
                totalCount++;
            }
        }
    }

    const oldest = [...products]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => new Date(a.dateOfProduction).getTime() - new Date(b.dateOfProduction).getTime())
        .slice(0, 5);

    return { products, loading, counts, oldest, totalCount };
};
