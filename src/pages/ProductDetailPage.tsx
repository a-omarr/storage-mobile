import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types/product';
import ProductCard from '../components/Product/ProductCard/ProductCard';

const ProductDetailPage: React.FC = () => {
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

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <Alert
                type="error"
                message={error || 'منتج غير موجود'}
                style={{ fontFamily: 'Cairo, sans-serif' }}
            />
        );
    }

    return <ProductCard product={product} />;
};

export default ProductDetailPage;
