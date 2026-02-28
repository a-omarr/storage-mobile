import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../db/productService';
import type { Product } from '../../types/product';

export const useProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        getProductById(id)
            .then((p) => {
                if (!cancelled) {
                    if (p) setProduct(p);
                    else setError('المنتج غير موجود');
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
    }, [id]);

    return { product, loading, error };
};

