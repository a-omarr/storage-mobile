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
        .sort((a, b) => {
            const dateA = a.dateOfProduction ? new Date(a.dateOfProduction).getTime() : 0;
            const dateB = b.dateOfProduction ? new Date(b.dateOfProduction).getTime() : 0;
            return dateA - dateB;
        })
        .slice(0, 5);

    return { products, loading, counts, oldest, totalCount };
};
