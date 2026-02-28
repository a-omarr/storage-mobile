import { useProducts } from '../../hooks/useProducts';

export const useHome = () => {
    const { products, loading } = useProducts();

    const counts: Record<string, number> = {};
    for (const p of products) {
        if (p.sections && Array.isArray(p.sections)) {
            for (const section of p.sections) {
                counts[section] = (counts[section] || 0) + 1;
            }
        }
    }

    const oldest = [...products]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => a.dateOfProduction.toMillis() - b.dateOfProduction.toMillis())
        .slice(0, 5);

    return { products, loading, counts, oldest };
};
