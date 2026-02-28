import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';

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

    // Expand each product into one entry per section so that a product
    // added to A, B, C, D shows up as four independent cards in the oldest widget.
    const expandedBySection: (Product & { displaySection: string })[] = [];
    for (const p of products) {
        if (!p.dateOfProduction) continue;
        for (const section of (p.sections ?? [])) {
            expandedBySection.push({ ...p, displaySection: section });
        }
    }

    const oldest = expandedBySection
        .sort((a, b) => {
            const dateA = new Date(a.dateOfProduction!).getTime();
            const dateB = new Date(b.dateOfProduction!).getTime();
            return dateA - dateB;
        })
        .slice(0, 5);

    return { products, loading, counts, oldest, totalCount };
};
