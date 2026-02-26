import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Product } from '../../types/product';

export const useProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const unsub = onSnapshot(
            doc(db, 'products', id),
            (snap) => {
                if (snap.exists()) {
                    setProduct({ id: snap.id, ...snap.data() } as Product);
                } else {
                    setError('المنتج غير موجود');
                }
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return () => unsub();
    }, [id]);

    return { product, loading, error };
};
