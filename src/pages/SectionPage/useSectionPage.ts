import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsBySection } from '../../db/productService';
import type { Product, SectionKey } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';

export const useSectionPage = () => {
    const { section } = useParams<{ section: SectionKey }>();
    const navigate = useNavigate();
    const sectionKey = section as SectionKey;
    const sectionConfig = sectionKey ? SECTION_MAP[sectionKey] : null;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refresh = () => setTick(t => t + 1);

    useEffect(() => {
        if (!sectionKey) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        getProductsBySection(sectionKey)
            .then((results) => {
                if (!cancelled) {
                    // Attach displaySection for context-aware operations
                    const mapped = results.map(p => ({ ...p, displaySection: sectionKey }));
                    setProducts(mapped);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(String(err));
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [sectionKey, tick]);

    const handleAddProduct = () => {
        navigate(`/add?section=${sectionKey}`);
    };

    return { sectionKey, sectionConfig, products, loading, error, handleAddProduct, refresh };
};

